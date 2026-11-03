import test from "node:test";
import assert from "node:assert/strict";
import { skills } from "../data/skills.ts";
import { recommendSkills } from "./recommend.ts";

test("a natural-language website request recommends frontend Skill with an explanation", () => {
  const found = recommendSkills(skills, "我想將我的網站變得更美觀、排版更專業", 5);
  assert.ok(found.length > 0);
  assert.ok(found.some(row => ["frontend-design","landing-page-design"].includes(row.skill.slug)));
  assert.ok(found.every(row => row.reason?.length >= 6));
});

test("a browser testing request prioritizes webapp-testing or playwright", () => {
  const found = recommendSkills(skills,"我需要用瀏覽器自動測試網頁的表單與按鈕",5);
  assert.ok(found.some(x=>["webapp-testing","playwright"].includes(x.skill.slug)));
});
test("Simplified Chinese description is also recognized", () => {
  const found=recommendSkills(skills,"我想做一个网站首页并改善页面布局",5);
  assert.ok(found.some(x=>["frontend-design","landing-page-design"].includes(x.skill.slug)));
});
test("video request maps to existing video tooling, not unrelated Skills", () => {
  const found=recommendSkills(skills,"我想用代码生成五秒钟循环动画视频",4);
  assert.ok(found.some(x=>x.skill.slug.startsWith("remotion")));
});
test("an unrelated question does not hallucinate a skill recommendation", () => {
  assert.equal(recommendSkills(skills,"家裡種植蘋果樹需要多少雨水",5).length,0);
});
test("empty or overly generic input has no recommendation", () => {
  assert.equal(recommendSkills(skills,"我想做些事情",5).length,0);
  assert.equal(recommendSkills(skills,"",5).length,0);
});
test("duplicate repo skill entries remain distinguishable", () => {
  const found=recommendSkills(skills,"我想做網頁設計",15);
  assert.equal(new Set(found.map(x=>x.skill.id)).size,found.length);
});
