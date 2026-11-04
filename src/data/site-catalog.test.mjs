import test from "node:test";
import assert from "node:assert/strict";
import { skills, getSkillBySlug, installCommand, sourceFileUrl } from "./skills.ts";
test("catalog has at least 100 verified localized Skills",()=>{
  assert.ok(skills.length>=100,"expected 100+, got "+skills.length);
  assert.ok(skills.filter(s=>s.sourceKind!=="local").every(s=>s.sourceFileUrl.includes("/SKILL.md") && /^[0-9a-f]{40}$/.test(s.sha)));
});
test("local-only skills are searchable catalog entries without fabricated install commands or source links",()=>{
 for(const slug of ["website-style-blueprint-extractor","screenshot-to-website-prompt"]){
  const skill=getSkillBySlug(slug);
  assert.ok(skill);
  assert.equal(skill.sourceKind,"local");
  assert.equal(installCommand(skill),null);
  assert.equal(sourceFileUrl(skill),null);
 }
});
test("canonical ids stay unique across source repositories",()=>{
  assert.equal(new Set(skills.map(s=>s.id)).size,skills.length);
});
test("installation uses frontmatter name when it differs from folder name",()=>{
  const s=skills.find(x=>x.id==="vercel-labs/agent-skills/react-best-practices");
  assert.ok(s);
  assert.equal(installCommand(s),`npx skills add ${s.source} --skill ${s.name}`);
  assert.ok(s.name.startsWith("vercel-"));
});
test("skill detail lookup finds route keys",()=>{
  for(const s of skills)assert.equal(getSkillBySlug(s.routeSlug)?.id,s.id);
});
test("source link points to existing SKILL.md path",()=>{
 const s=skills.find(x=>x.slug==="landing-page-design");
 assert.equal(sourceFileUrl(s),s.sourceFileUrl);
 assert.match(sourceFileUrl(s),/github\.com\/elayadesign\/ai-design-skills\/blob\/main\/skills\/landing-page-design\/SKILL\.md/);
});
