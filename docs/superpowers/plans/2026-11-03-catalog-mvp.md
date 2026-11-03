# 技集中文目錄第一批 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 交付可本機運行、能搜尋、瀏覽、查看教學並複製命令的中文 Skill 目錄。

**Architecture:** Next.js App Router，Typed 靜態 Skill 資料作為第一批唯一資料來源；首頁用 client component 篩選，詳細頁由 server route 產生。避免依賴需 OIDC 的實時 API。

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-11-03-skill-atlas-design.md`

## Global Constraints
- 不連接用戶的 Codex 或自行安裝第三方 Skill。
- 所有展示項目有真實來源、中文編輯摘要及複製指令。
- 不偽造安裝量、來源更新時間或安全評分。
- 手機 390px 不橫向溢出，尊重減少動態設定。

## Review Focus
- 搜尋不存在的關鍵字時顯示空狀態，不崩潰。
- 中英輸入與空白大小寫混用應得到可理解的結果。
- 未收錄 slug 應返回 404。
- 複製失敗時應顯示指導，不冒充複製成功。
- 沒有外部 API 憑據時仍可本機瀏覽。

---

### Task 1: 資料與搜尋
**Files:** `src/data/skills.ts`、`src/lib/search.ts`、`src/lib/search.test.ts`
**Interfaces:** `Skill` 型別；`skills` 陣列；`filterSkills(skills, options)`
- [x] 建立具真實來源的種子資料和型別。
- [x] 編寫搜尋、分類、空查詢等測試。
- [x] 執行測試，檢查中文與英文情況。

### Task 2: 首頁目錄
**Files:** `src/app/page.tsx`、`src/components/catalog.tsx`、`src/app/globals.css`
**Interfaces:** 消耗 `skills` 與 `filterSkills`
- [x] 建立主導覽、搜尋與分類、卡片、空狀態。
- [x] 測試本機首頁 200，確認分類與搜尋交互。

### Task 3: 詳細頁與複製
**Files:** `src/app/skills/[slug]/page.tsx`、`src/components/copy-button.tsx`
**Interfaces:** 使用 `getSkillBySlug`
- [x] 建立中文用途、場景、安裝與最佳調用指南。
- [x] 驗證命令複製成功與回退，來源連結可追溯。
- [x] 驗證未知 slug 404。

### Task 4: 文件、品質與驗收
**Files:** `src/app/about/page.tsx`、`README.md`、`docs/PROGRESS.md`
- [x] 執行 lint、TypeScript、build 與測試。
- [x] 本機啟動並檢查可開首頁、詳細頁、404。
- [x] 紀錄完成與未完部分，交給使用者驗收後停止。

