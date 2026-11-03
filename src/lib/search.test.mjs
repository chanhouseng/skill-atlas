import test from "node:test";
import assert from "node:assert/strict";
import { filterSkills } from "./search.ts";

const sample = [
  { slug: "frontend-design", zhName: "前端設計", summary: "改善網站設計", category: "網頁與視覺設計", source: "anthropics/skills", tags: ["React", "UI"], scenarios: ["網頁首頁"], featured: true },
  { slug: "docx", zhName: "Word 文件", summary: "編輯文件", category: "文件與辦公", source: "anthropics/skills", tags: ["Word"], scenarios: ["Word 排版"], featured: false },
  { slug: "mcp-builder", zhName: "MCP 工具", summary: "建立 Agent 工具", category: "Agent 與自動化", source: "anthropics/skills", tags: ["MCP"], scenarios: ["串接外部 API"], featured: true },
];

test("empty search returns all", () => assert.equal(filterSkills(sample, {}).length, 3));
test("Chinese search finds summary", () => assert.deepEqual(filterSkills(sample, {query:"網站"}).map(s=>s.slug), ["frontend-design"]));
test("English match is case insensitive", () => assert.deepEqual(filterSkills(sample, {query:"  REACT "}).map(s=>s.slug), ["frontend-design"]));
test("multi token search requires all keywords", () => assert.equal(filterSkills(sample, {query:"React Word"}).length, 0));
test("category filters correctly", () => assert.deepEqual(filterSkills(sample, {category:"文件與辦公"}).map(s=>s.slug), ["docx"]));
test("featuredOnly restricts results", () => assert.equal(filterSkills(sample, {featuredOnly:true}).length,2));
test("unknown keyword returns empty", () => assert.deepEqual(filterSkills(sample, {query:"does-not-exist"}), []));
