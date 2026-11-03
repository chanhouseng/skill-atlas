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
