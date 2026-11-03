# 第二批：可信來源與中文 Skill 目錄

## 已有授權
2026-11-03 使用者確認第一批滿意，要求進入第二批。首要目標為 R07（約 100 個來源核對項目）與 R08（可重複執行的來源同步）。保留既有 UI 核心流程及明確排除 Codex 遠端安裝、AI 即時提示詞生成器、用戶帳號。

## 產品決定
- 第二批規模目標至少 100 個**實際存在的**公開 GitHub Skill。每個必須有可打開的 SKILL.md 原始路徑及 SHA，資料來源列表固定於 repo 白名單，避免自動引入惡意指引。
- 介紹和調用示例以本站中文編輯稿呈現；原作者的英文 frontmatter 只用來核對，不把任何第三方規則當作本站命令執行。
- 同名 Skill 以 `source/slug` 唯一識別；舊網址若仍唯一則保留，衝突時新增 repo 前綴路由。
- 不顯示未核實的 skills.sh URL、安裝量與安全分數。安裝命令僅作複製，不在網站執行。
- 對每筆 Skill 顯示 GitHub 原始 SKILL.md 與最後來源同步日期；若原始 SHA 改變，標註中文介紹待重新審閱。
- 更新不是網站訪客即時觸發。由維護者手動在本機以 `npm run sync:skills` 執行；一次同步成功才替換快照，失敗時保留已知可用資料。
- 首次可透過 GitHub 公開 REST API 抓取；無 Token 時遵守限制；選用 token 時只存在本機環境、不得寫入 Git。不使用 Vercel OIDC 身分憑據，skills.sh API 尚未串接。

## 資料層
`src/data/catalog.sources.json`：白名單來源與指定 Skill 名稱；`src/data/catalog.zh.json`：每個 canonical id 的中文名稱、摘要、場景、調用示例、分類；`src/data/catalog.snapshot.json`：GitHub 來源路徑、blob SHA、最近核對時間及描述。提供單一純函式將三者合併並做基本檢查。
`scripts/sync-github.mjs`：對來源 Git Tree 查檔案、按 SHA 變更取得 markdown frontmatter、保存快照；失敗採整批回退並清晰報錯。只讀取第三方文字，不執行第三方指令。
`src/data/skills.ts`：將上述資料轉為前端 Skill 型別並提供查詢、URL、安裝命令。按資料證據呈現「已核實來源／中文待複核」。

## 驗收與風險
- 至少 100 筆且 `source/slug` 無重複；每一筆有 GitHub SKILL.md 路徑及不空的中文資料。
- 使用者能在網站上按舊有方式搜尋與閱讀；複製命令與來源鏈接正常。
- 同名與不存在 slug、來源更新、來源無法連線、資料缺失需測試。
- 390px 手機版無溢出；HTTP 404 正常；測試、型別、lint、正式 build 通過。
- 無憑據時不得聲稱同步了 skills.sh API；外部更新的可信程度仍取決於上游庫與授權。
