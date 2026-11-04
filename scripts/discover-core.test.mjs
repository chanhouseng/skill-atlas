import test from "node:test";
import assert from "node:assert/strict";
import { discoverNewSkills } from "./discover-core.mjs";
import * as discovery from "./discover-github.mjs";
const {github}=discovery;

test('existing weekly PR candidates are preserved along with main candidates',async()=>{
 const branch=[{id:'b/repo:skills/b/SKILL.md',source:'b/repo',path:'skills/b/SKILL.md',firstSeen:'old'}];
 const base=[{id:'a/repo:skills/a/SKILL.md',source:'a/repo',path:'skills/a/SKILL.md'}];
 const api=async url=>url.includes('/git/ref/')?{object:{sha:'a'.repeat(40)}}:{encoding:'base64',content:Buffer.from(JSON.stringify({candidates:branch})).toString('base64')};
 const result=await discovery.loadPreviousCandidates(base,'owner/repo',api);
 assert.deepEqual(result.candidates.map(x=>x.id),[base[0].id,branch[0].id]);
 assert.equal(result.head,'a'.repeat(40));
});
test('previous candidates are not silently truncated above 800',async()=>{
 const previous=Array.from({length:801},(_,i)=>({id:'old/repo:skills/s'+i+'/SKILL.md',source:'old/repo',path:'skills/s'+i+'/SKILL.md',firstSeen:'old'}));
 const result=await discoverNewSkills({queries:['q'],search:async()=>[],tree:async()=>[],previous,now:'new'});
 assert.equal(result.candidates.length,801);
});
test('only repositories with at least 3000 stars are searched',async()=>{
 const result=await discoverNewSkills({queries:['q'],search:async()=>[{...a,stargazers_count:2999},{...b,stargazers_count:3000}],tree:async()=>tree('x'),now:'new'});
 assert.deepEqual(result.candidates.map(x=>x.source),['owner/test-skills']);
});
test('a missing weekly branch is allowed, but inaccessible or invalid snapshots abort',async()=>{
 const missing=await discovery.loadPreviousCandidates([],'owner/repo',async()=>{throw Object.assign(new Error('missing'),{status:404})});
 assert.equal(missing.head,'none');
 await assert.rejects(discovery.loadPreviousCandidates([],'owner/repo',async()=>{throw Object.assign(new Error('forbidden'),{status:403})}),/forbidden/);
 await assert.rejects(discovery.loadPreviousCandidates([],'owner/repo',async url=>url.includes('/git/ref/')?{object:{sha:'a'.repeat(40)}}:{encoding:'base64',content:Buffer.from('{}').toString('base64')}),/candidate/i);
});

test("retries a temporary 409 from a repository tree",async()=>{
 let calls=0;
 const result=await github("https://api.github.com/repos/example/repo/git/trees/HEAD?recursive=1",{
  fetchImpl:async()=>{calls++; return calls===1 ? new Response('{}',{status:409}) : new Response('{"tree":[]}',{status:200});},
  waitImpl:async()=>{}
 });
 assert.deepEqual(result,{tree:[]});
 assert.equal(calls,2);
});

const a={full_name:"owner/design-skills",description:"Useful design skills",fork:false,archived:false,stargazers_count:3000};
const b={full_name:"owner/test-skills",description:"Browser workflow tools",fork:false,archived:false,stargazers_count:3000};
const tree=(slug)=>[{path:`skills/${slug}/SKILL.md`,type:"blob",mode:"100644",sha:"a".repeat(40)}];

test("discovery skips symbolic links and retains regular files and unscanned candidates",async()=>{
 const link='owner/design-skills:.antigravitycli/skills/career-ops/SKILL.md';
 const previous=[{id:link,source:a.full_name,path:'.antigravitycli/skills/career-ops/SKILL.md',firstSeen:'old'}, {id:'other/repo:skills/old/SKILL.md',source:'other/repo',path:'skills/old/SKILL.md',firstSeen:'old'}];
 const result=await discoverNewSkills({queries:['q'],search:async()=>[a],tree:async()=>[
  {path:'.antigravitycli/skills/career-ops/SKILL.md',type:'blob',mode:'120000',sha:'a'.repeat(40)},
  {path:'.agents/skills/career-ops/SKILL.md',type:'blob',mode:'100644',sha:'b'.repeat(40)}
 ],previous,now:'new',maxPerRepo:1});
 assert.deepEqual(result.candidates.map(c=>c.id).sort(),['other/repo:skills/old/SKILL.md','owner/design-skills:.agents/skills/career-ops/SKILL.md']);
});

test("finds SKILL.md and produces pending, source-linked candidates only",async()=>{
 const result=await discoverNewSkills({
  queries:["q1"],search:async()=>[a],tree:async()=>tree("web-design"),
  existing:[],previous:[],now:"2026-11-03T00:00:00Z",maxRepos:10
 });
 assert.equal(result.candidates.length,1);
 const c=result.candidates[0];
 assert.equal(c.status,"pending");
 assert.equal(c.sourceFileUrl,"https://github.com/owner/design-skills/blob/HEAD/skills/web-design/SKILL.md");
 assert.equal(c.id,"owner/design-skills:skills/web-design/SKILL.md");
});
test("never duplicates same repository across search queries",async()=>{
 let visits=0;
 const result=await discoverNewSkills({queries:["a","b"],search:async()=>[a],tree:async()=>{visits++;return tree("web-design");},existing:[],previous:[],now:"now"});
 assert.equal(result.candidates.length,1);
 assert.equal(visits,1);
});
test("previously verified skills are not returned as pending",async()=>{
 const result=await discoverNewSkills({queries:["a"],search:async()=>[a],tree:async()=>tree("web-design"),
  existing:[{source:"owner/design-skills",slug:"web-design",path:"skills/web-design/SKILL.md"}],previous:[],now:"now"});
 assert.equal(result.candidates.length,0);
});
test("retains firstSeen and does not duplicate previous candidate",async()=>{
 const previous=[{id:"owner/design-skills:skills/web-design/SKILL.md",firstSeen:"old",status:"pending"}];
 const result=await discoverNewSkills({queries:["a"],search:async()=>[a],tree:async()=>tree("web-design"),existing:[],previous,now:"new"});
 assert.equal(result.candidates.length,1);
 assert.equal(result.candidates[0].firstSeen,"old");
 assert.equal(result.candidates[0].lastSeen,"new");
});
test("rejects malformed or suspicious source paths",async()=>{
 const result=await discoverNewSkills({queries:["a"],search:async()=>[a],tree:async()=>[
  {path:"evil/../private/SKILL.md",type:"blob",sha:"a".repeat(40)},
  {path:"skills/alpha/scripts/x.js",type:"blob",sha:"a".repeat(40)}
 ],existing:[],previous:[],now:"now"});
 assert.equal(result.candidates.length,0);
});
test("does not return partial data on a failed GitHub query",async()=>{
 await assert.rejects(discoverNewSkills({queries:["a","b"],search:async(q)=>{if(q==="b")throw new Error("rate limit");return [a]},tree:async()=>tree("foo"),existing:[],previous:[],now:"now"}),/rate limit/);
});
test("excludes archived and forked repository results",async()=>{
 const result=await discoverNewSkills({queries:["a"],search:async()=>[{...a,fork:true},{...b,archived:true}],tree:async()=>tree("foo"),existing:[],previous:[],now:"now"});
 assert.equal(result.candidates.length,0);
});
