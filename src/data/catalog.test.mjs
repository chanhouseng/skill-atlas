import test from "node:test";
import assert from "node:assert/strict";
import { buildSkills } from "./catalog.ts";

const sha="a".repeat(40);
const record=(source,slug,shaValue=sha)=>({id:`${source}/${slug}`,source,slug,path:`skills/${slug}/SKILL.md`,sha:shaValue,name:slug,description:"Original verified description"});
const local=(id,reviewedSha=sha)=>({[id]:{zhName:"中文功能名稱",summary:"中文功能摘要",category:"程式開發",scenarios:["完成具體任務"],examplePrompt:"請使用這個技能，先讀清需求再執行。",caution:"安裝前檢查原始來源。",tags:["測試"],featured:false,reviewedSha}});
test("two skills with same slug from different repositories have unique routes",()=>{
  const s=buildSkills({syncedAt:"2026-11-03T00:00:00Z",entries:[record("a/repo","pdf"),record("b/repo","pdf")]},{...local("a/repo/pdf"),...local("b/repo/pdf")});
  assert.equal(s.length,2);
  assert.notEqual(s[0].routeSlug,s[1].routeSlug);
});
test("missing localized entry is not silently filled with invented Chinese content",()=>{
  assert.throws(()=>buildSkills({syncedAt:"x",entries:[record("a/repo","alpha")]},{}),/localization/i);
});
test("Chinese text is tied to source SHA and flagged when changed",()=>{
  const s=buildSkills({syncedAt:"x",entries:[record("a/repo","alpha","b".repeat(40))]},local("a/repo/alpha"))[0];
  assert.equal(s.needsReview,true);
});
test("rejects duplicate canonical identities",()=>{
  assert.throws(()=>buildSkills({syncedAt:"x",entries:[record("a/repo","alpha"),record("a/repo","alpha")]},local("a/repo/alpha")),/duplicate/i);
});
test("validated record includes exact GitHub SKILL.md source",()=>{
  const s=buildSkills({syncedAt:"x",entries:[record("a/repo","alpha")]},local("a/repo/alpha"))[0];
  assert.match(s.sourceFileUrl,/github.com\/a\/repo\/blob\/main\/skills\/alpha\/SKILL.md/);
});

test("keeps frontmatter install name distinct from folder route slug",()=>{
  const rec={...record("vercel-labs/agent-skills","composition-patterns"),name:"vercel-composition-patterns"};
  const s=buildSkills({syncedAt:"x",entries:[rec]},local("vercel-labs/agent-skills/composition-patterns"))[0];
  assert.equal(s.slug,"composition-patterns");
  assert.equal(s.name,"vercel-composition-patterns");
});
