import test from "node:test";
import assert from "node:assert/strict";
import { syncCatalog, extractMetadata, validatePublishableCatalog } from "./catalog-sync-core.mjs";

const sha1 = "a".repeat(40), sha2 = "b".repeat(40);
const sources = { "demo/skills": ["alpha","beta"] };
const tree = [
  { path:"skills/alpha/SKILL.md", sha:sha1, type:"blob" },
  { path:"skills/beta/SKILL.md", sha:sha2, type:"blob" }
];
const raw = "---\nname: alpha\ndescription: Accurate introductory guidance for task A\n---\n# Heading";
test("extracts quoted YAML description and name from SKILL.md", () => {
  assert.deepEqual(extractMetadata('---\nname: "alpha"\ndescription: "Test description"\n---\n# A'), { name:"alpha",description:"Test description" });
});
test("first sync requires real source paths and descriptions", async () => {
  const calls=[];
  const r=await syncCatalog({sources,previous:null,now:"2026-11-03T02:00:00.000Z",
    fetchTree:async()=>tree,
    fetchSkill:async(repo,path)=>{calls.push(path);return raw;},
  });
  assert.equal(r.entries.length,2);
  assert.deepEqual(calls,["skills/alpha/SKILL.md","skills/beta/SKILL.md"]);
  assert.equal(r.entries[0].id,"demo/skills/alpha");
  assert.equal(r.entries[0].sha,sha1);
});
test("unchanged sha does not refetch markdown", async () => {
  const previous=await syncCatalog({sources,previous:null,now:"2026-11-03T01:00:00Z",fetchTree:async()=>tree,fetchSkill:async()=>raw});
  const r=await syncCatalog({sources,previous,now:"2026-11-03T02:00:00Z",fetchTree:async()=>tree,
    fetchSkill:async()=>{throw new Error("should not fetch");}
  });
  assert.equal(r.entries[0].sha,sha1);
  assert.equal(r.stats.cached,2);
  assert.equal(r.syncedAt,"2026-11-03T02:00:00Z");
});
test("updated source sha requires new markdown read", async () => {
  const previous=await syncCatalog({sources,previous:null,now:"before",fetchTree:async()=>tree,fetchSkill:async()=>raw});
  const updated=tree.map(x=>x.path.includes("alpha")?{...x,sha:"c".repeat(40)}:x);
  const calls=[];
  const r=await syncCatalog({sources,previous,now:"after",fetchTree:async()=>updated,fetchSkill:async(_,path)=>{calls.push(path);return raw;}});
  assert.deepEqual(calls,["skills/alpha/SKILL.md"]);
  assert.equal(r.entries[0].sha,"c".repeat(40));
});
test("missing SKILL.md throws without a valid snapshot", async () => {
  await assert.rejects(
    syncCatalog({sources,previous:null,now:"now",fetchTree:async()=>tree.slice(0,1),fetchSkill:async()=>raw}),
    /missing/i
  );
});
test("network failure stops sync without returning a partial result", async () => {
  await assert.rejects(
    syncCatalog({sources,previous:null,now:"now",fetchTree:async()=>{throw new Error("offline");},fetchSkill:async()=>raw}),
    /offline/
  );
});
test("refuses ambiguous candidate paths rather than guessing", async () => {
  const dupe=[...tree,{path:"another/alpha/SKILL.md",sha:sha1,type:"blob"}];
  await assert.rejects(syncCatalog({sources,previous:null,now:"now",fetchTree:async()=>dupe,fetchSkill:async()=>raw}),/ambiguous/i);
});

test("parses indented multi-line description from YAML",()=>{
  const md="---\nname: vercel-composition-patterns\ndescription:\n  React composition patterns that scale.\n  Use when building reusable components.\nlicense: MIT\n---";
  assert.deepEqual(extractMetadata(md),{name:"vercel-composition-patterns",description:"React composition patterns that scale. Use when building reusable components."});
});

test("passes verified blob SHA to the fetcher",async()=>{
  const hashes=[];
  await syncCatalog({sources,previous:null,now:"x",fetchTree:async()=>tree,fetchSkill:async(_repo,_path,sha)=>{hashes.push(sha);return raw;}});
  assert.deepEqual(hashes,[sha1,sha2]);
});
test("ignores internal .system duplicate when curated SKILL.md exists",async()=>{
  const oneRepo={"demo/skills":["alpha"]};
  const files=[{path:"skills/.curated/alpha/SKILL.md",sha:sha1,type:"blob"},{path:"skills/.system/alpha/SKILL.md",sha:sha2,type:"blob"}];
  const r=await syncCatalog({sources:oneRepo,previous:null,now:"x",fetchTree:async()=>files,fetchSkill:async()=>raw});
  assert.equal(r.entries[0].path,"skills/.curated/alpha/SKILL.md");
});

test("publishing requires Chinese localization for every verified source",()=>{
  const snapshot={syncedAt:"x",entries:[{id:"demo/skills/alpha",source:"demo/skills",slug:"alpha",path:"skills/alpha/SKILL.md",sha:sha1,name:"alpha",description:"A"}]};
  assert.throws(()=>validatePublishableCatalog(snapshot,{}),/localization/i);
  assert.equal(validatePublishableCatalog(snapshot,{"demo/skills/alpha":{zhName:"中文說明",summary:"用途",examplePrompt:"示例",scenarios:["場景"]}}),true);
});
