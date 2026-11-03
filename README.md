# 技集 Skill Atlas

> 繁體中文 AI Skill 目錄：搜尋、分類、來源核對、安裝命令與調用指南。

本專案是獨立的中文教學網站，**不是** skills.sh 官方產品，也**不會**登入／操作用戶的 Codex、Claude Code 或 Cursor。

## 本機啟動（Windows 11）

先安裝 Node.js 24（目前開發環境為 v24.19.0），開啟 PowerShell：

```powershell
cd "$env:USERPROFILE\Desktop\skill-atlas-zh"
npm install
npm run dev -- -p 3026 --hostname 127.0.0.1
```

然後在瀏覽器打開 http://127.0.0.1:3026 。

## 已完成（第一批）
- 中文首頁、關鍵字搜尋（中／英文、分詞比對）、8 分類、編輯精選
- 38 個有原始來源的 Skill 中文編輯摘要
- Skill 詳細頁：場景、注意事項、安裝命令與範例提示詞
- 一鍵複製、來源連結、空結果、404、響應式布局
- 搜尋函式自動測試

## 品質檢查

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

## 目錄結構
```text
src/app/                  Next.js 首頁、詳細頁、使用指南
src/components/           搜尋目錄與複製按鈕
src/data/skills.ts        第一批人工整理資料
src/lib/search.ts         純函式搜尋與分類
src/lib/search.test.mjs   搜尋行為測試
docs/PRD.md               已確認需求與後續批次
docs/PROGRESS.md          開發進度與驗收
docs/TECH_DEBT.md         已知風險與 Bug
AGENTS.md                 專案持久規則
```

## 資料來源與限制

資料初始來源為 [skills.sh](https://skills.sh) 公開列目與相關 [GitHub](https://github.com) 專案。中文介紹與提示詞是本站編寫，**不是官方翻譯或保證最佳**，且未做第三方獨立安全審查。

[skills.sh API 文件](https://skills.sh/docs/api) 表示正式 API 需 Vercel OIDC。因此第一批沒有即時 API 同步、即時安裝數、安全評分或作者即時更新狀態。第二批才討論增量同步、授權及大量收錄。第一批原始清單不是全站 Skill 排名。

## 安全提醒
網站沒有收集用戶帳號及輸入內容；搜尋在瀏覽器本機進行。請勿不經檢查就執行來自陌生倉庫的 Skill 指令，安裝前閱讀 SKILL.md 及相關依賴。
