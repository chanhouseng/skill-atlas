# Phase 3 Skill Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 交付自然語言推薦、繁簡雙語，以及不冒充全量的每週 GitHub 新 Skill 發現。

**Architecture:** 靜態技能目錄以純函式規則排序；繁簡採 OpenCC + 網站共用語言狀態；GitHub 發現為維護者獨立 CLI，安全候選快照與正式目錄隔離。

**Tech Stack:** Next.js 16, TypeScript, React, opencc-js, Node.js 24, GitHub REST, Playwright

**Spec:** docs/superpowers/specs/2026-11-03-phase3-search-language-discovery.md

## Global Constraints
- 已收錄 117 個來源已核對 Skill 不減少；不顯示虛構的安裝數、審計或 AI 精度。
- 不遠端操作用戶 AI 工具；不執行第三方 SKILL.md；候選不自動發布。
- 維持 SEO 導覽、404、400px 左右手機尺寸及非同步來源同步的原子回退。
- 每批有測試與證據；第 3 批完成後停止，留待用戶驗收。

## Review Focus
- 自然語言長句、否定、完全不相干與多種中文字體下的匹配。
- 簡體切換不要破壞英文 Skill 名稱、命令或路由。
- GitHub API 部分失敗不能覆蓋舊候選集。
- 同名不同 repo 不重複/合併錯誤，安全審核不能混淆。
- 每週排程的本地/雲端啟用狀態必須如實說明。

### Task 1: 自然語言推薦
**Files:** `src/lib/recommend.ts`, `src/lib/recommend.test.mjs`, `src/components/catalog.tsx`。
- [x] 先做命中及不相干的失敗測試。
- [x] 以已核對 Skill 的場景、類別、同義詞及明確規則實作推薦和理由。
- [x] 在首頁新增描述需求、推薦列表及無結果回退；保留原搜尋。
- [x] 回歸並 commit。

### Task 2: 繁體／簡體切換
**Files:** `src/components/language-provider.tsx`, `src/components/language-switch.tsx`, `src/app/layout.tsx`, `src/components/catalog.tsx`, `src/app/skills/[slug]/page.tsx`, `src/lib/zh.ts`。
- [x] 先驗證 OpenCC 與測試可避免轉換命令/URL。
- [x] 全站中文顯示切換，保留語言偏好；兩種中文搜尋均可。
- [x] 測試首頁、詳細頁、使用指南的繁簡切換。
- [x] 回歸並 commit。

### Task 3: GitHub 新 Skill 發現及每週更新
**Files:** `scripts/discover-github.mjs`, `scripts/discover-core.mjs`, `scripts/discover-core.test.mjs`, `src/data/discovery.candidates.json`, `.github/workflows/weekly-skills.yml`, `docs/PROGRESS.md`。
- [x] 先建立重複/來源失效/假陽性/半途失敗測試。
- [x] 用可限速的 GitHub repo 搜尋＋樹核對候選，不執行外部文件。
- [x] 增量合併候選並區分待審核、正式已收錄。
- [x] 設定每週排程（需 GitHub 預設分支或本地已啟用排程）；驗證結果及文件。
- [x] 完整測試、提交，不擅自推送遠端或合併主分支。
