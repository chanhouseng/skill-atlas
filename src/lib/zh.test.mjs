import test from "node:test";
import assert from "node:assert/strict";
import { toDisplayChinese, normalizeChineseSearch } from "./zh.ts";
test("convert traditional interface text to simplified Chinese", () => {
  assert.equal(toDisplayChinese("搜尋技能，查看使用指南", "zh-Hans"), "搜索技能，查看使用指南");
});
test("traditional is preserved by default", () => {
  assert.equal(toDisplayChinese("搜尋技能，查看使用指南", "zh-Hant"), "搜尋技能，查看使用指南");
});
test("technical English names and install commands stay unchanged", () => {
  assert.equal(toDisplayChinese("npx skills add anthropics/skills --skill frontend-design", "zh-Hans"), "npx skills add anthropics/skills --skill frontend-design");
});
test("simplified and traditional searches normalize to same representation", () => {
  assert.equal(normalizeChineseSearch("网站设计"),normalizeChineseSearch("網站設計"));
  assert.equal(normalizeChineseSearch("软件开发"),normalizeChineseSearch("軟件開發"));
});
