# 技集 Skill Atlas

> 用中文找到合適的 AI Skill，了解用途、適用場景、安裝方法及如何調用。

這是一個獨立的繁體中文 Skill 目錄，**不是 skills.sh 官方網站**；不連接使用者的 Codex、Claude Code 或 Cursor，不代為安裝或遠端執行 Skill。

## 本機啟動

要求：Windows 11、Node.js 24、npm。

```powershell
cd "$env:USERPROFILE\Desktop\skill-atlas-zh"
npm install
npm run dev -- -p 3026 --hostname 127.0.0.1
```

然後使用本機瀏覽器打開 http://127.0.0.1:3026 。

## 第二批功能（2026-11-03）

- **117 個 Skill**，來自 **8 個**公開 GitHub 倉庫；每個都有原始 `SKILL.md`、SHA（原始版本指紋）與核對日期。
- 依中文、英文名稱／關鍵字搜尋，8 類篩選、精選篩選、列表分批顯示、無結果提示。
- 詳細頁顯示中文用途、適用場景、使用前提醒、原始指引連結、安裝指令與可複製的中文調用範例。
- 同名 Skill 使用倉庫＋名稱辨識；個別 Skill 的 frontmatter `name` 與資料夾名稱不同時，安裝命令採用實際 `name`。
- 作者更新了 `SKILL.md` 但中文內容尚未複核時，詳細頁會顯示「原始 Skill 有新版本」提醒。
- 手機與桌面響應式，鍵盤可操作；404 頁面有效。

## 資料同步

本版**不是直接對接 skills.sh API**。由維護者用 GitHub 公開 REST API 手動同步白名單倉庫，網站訪客不會觸發同步：

```powershell
cd "$env:USERPROFILE\Desktop\skill-atlas-zh"
npm run sync:skills
```

同步會抓取各倉庫的 SKILL.md 檔案路徑及 SHA，**只對 SHA 改變的檔案重新讀取文字**，不會執行任何第三方 Skill 程式碼。所有來源核對成功、中文資料完整才原子地替換快照；網絡失敗、API 限額或新增項目缺少中文說明時，舊快照保持可用。GitHub 匿名 API 有請求限額；可選在目前終端機環境設定 `GITHUB_TOKEN`，請勿放入源碼、日誌或 Git。

同步完成後，重新啟動正式網站即可使用最新快照；開發模式下可重新整理頁面。

若需要編輯中文介紹：修改 `src/data/catalog.zh.tsv`，再執行：

```powershell
npm run catalog:localize
```

產生 `src/data/catalog.zh.json`。如果原始內容 SHA 已經改變，編輯器**必須真正閱讀新 SKILL.md**，人工核對中文內容後，才把該 JSON 項目的 `reviewedSha` 更新為新快照的 `sha`。同步不會自動宣告中文內容審閱通過。新增來源則須先準備完整中文條目才可正式發布。

## 本機測試與驗收

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

端到端互動測試需先開啟本機開發伺服器，並有本機 Chrome：

```powershell
npm run qa:e2e
```

檢查中文搜尋、分類、查找原始文件、複製命令、404 與 390px／1440px 版面。測試截圖保存在本機 `docs/qa-phase2-*.png`，預設不提交到 Git。

## 核心檔案

```text
AGENTS.md                         專案規則
docs/PRD.md                       需求及分批驗收
docs/PROGRESS.md                  交付、證據及下一步
docs/TECH_DEBT.md                 已知技術風險與 Bug
src/app/                           頁面及路由
src/components/                    搜尋目錄與複製功能
src/data/catalog.sources.json      GitHub 來源白名單
src/data/catalog.snapshot.json     已核對來源、SHA、原始描述
src/data/catalog.zh.tsv            中文編輯稿
src/data/catalog.zh.json           網站使用的中文資料
src/data/catalog.ts                來源＋中文資料驗證與映射
scripts/sync-github.mjs            手動來源增量同步
scripts/catalog-sync-core.mjs      同步驗證及失敗保護
scripts/compile-localizations.mjs  中文資料轉換
scripts/qa-phase2.mjs              本機 Chrome 互動驗收
```

## 內容可靠性與限制

- **來源可核對 ≠ 安全審核通過**。本站未做第三方 Skill 的完整安全審查，也沒有逐一實際執行安裝命令。
- 中文名稱、摘要及提示詞是**本站編輯內容**，不是原作者官方翻譯或經第三方人工全面審校。實際功能及最新要求請以來源倉庫為準。
- 不展示來源未確認的安裝數、排行榜數據或安全分數；本目錄並不等於 skills.sh 的完整收錄。
- [skills.sh API 文件](https://skills.sh/docs/api) 所述 API 需 Vercel OIDC，本站未連接該 API。沒有憑據時不繞過驗證限制。
- 網站尚未公開部署；目前只在你的 Windows 本機運行。

## 第三批功能（2026-11-03）

### 用自然語言找 Skill

首頁的「不知道 Skill 名稱？直接說你想做甚麼。」區域可輸入中文完整需求。系統以本機規則、同義詞及已收錄的技能用途來排序，最多列出 5 個 Skill、推薦原因及實際使用指南。

這是**免付費 API 的可解釋意圖匹配**，不是大模型或真正通用的語意搜尋。未知需求會顯示無結果；輸入不會上傳外部服務。

### 簡體／繁體切換

網站右上角提供語言切換，使用開源 `opencc-js`；首頁、中文介紹、推薦原因、詳細頁和複製的中文示例會切換。英文 Skill `name`、slug、GitHub 來源和安裝指令不會改動。偏好保存在本機瀏覽器 LocalStorage。

### GitHub 新 Skill 候選

訪問 `/discoveries` 查看「**新發現・待審核**」資料。當前有 20 個來自 GitHub 連接工具的來源路徑已核對候選，這只是一次手動初始化，**不是本週自動掃描已成功的證據**；候選與正式的 117 個已核對 Skill 分開，不提供安裝命令。

維護者在 PowerShell 中執行：

```powershell
npm run discover:skills
npm run sync:skills
```

`discover:skills` 以 GitHub 公開搜尋 API 找最近有活動的 Agent Skill 倉庫，再用 Git tree 驗證 `SKILL.md` 路徑，保留舊資料、去除已正式收錄的來源、拒收可疑路徑及失敗的半成品。結果寫在 `src/data/discovery.candidates.json`。它**不能找到 GitHub 上全部 Skill**；匿名 API 有速率限制，如遇 403 請在自己環境設置 `GITHUB_TOKEN`（不要寫入檔案）。

### 已設定每週排程

- 已在本機 Windows Task Scheduler 登記 `Skill Atlas Weekly Discovery`，**每週一 09:17（電腦 China Standard Time，UTC+8）**執行 `scripts/weekly-sync.ps1`。
- 首次預定執行日期 **2026-11-09 09:17**。電腦需要開啟；如睡眠、斷網或 GitHub 限額耗盡，可能延遲或失敗。Windows 設定 `StartWhenAvailable`，但不能代替 24 小時在線雲端排程。執行記錄存在 `logs/`（不提交 Git）。
- 另提供 `.github/workflows/weekly-skills.yml`：週一 01:17 UTC 使用 GitHub Actions 內建 Token 批量掃描，並提出需人工審核的 PR，**不自動合併、安裝或正式發布候選**。因為本機專案目前未配置 Git remote，這份雲端工作流程**尚未在 GitHub 上啟用**。必須先將倉庫推送到 GitHub 的預設分支，並允許 Actions 建立 PR。

### 第三批驗收

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
npm run qa:phase3
```

端到端測試需先在本機啟動 3026 端口與 Chrome。截圖位於 `docs/qa-phase3-*.png`，不追蹤到 Git。
