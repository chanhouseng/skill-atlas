import test from "node:test";
import assert from "node:assert/strict";
import { discoverNewSkills } from "./discover-core.mjs";
import { github } from "./discover-github.mjs";

test("retries a temporary 409 from a repository tree",async()=>{
 let calls=0;
 const result=await github("https://api.github.com/repos/example/repo/git/trees/HEAD?recursive=1",{
  fetchImpl:async()=>{calls++; return calls===1 ? new Response('{}',{status:409}) : new Response('{"tree":[]}',{status:200});},
  waitImpl:async()=>{}
 });
 assert.deepEqual(result,{tree:[]});
 assert.equal(calls,2);
});

const a={full_name:"owner/design-skills",description:"Useful design skills",fork:false,archived:false};
const b={full_name:"owner/test-skills",description:"Browser workflow tools",fork:false,archived:false};
const tree=(slug)=>[{path:`skills/${slug}/SKILL.md`,type:"blob",sha:"a".repeat(40)}];

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
