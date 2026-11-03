# 技集 Skill Atlas｜開發進度與驗收

**更新：2026-11-03**
**工作分支：** `feat/phase2-skill-catalog`（尚未合併主分支，等待使用者驗收）

## 第一批：已獲使用者驗收

第一批實作中文首頁、分類、搜尋、38 個精選 Skill、詳細頁、安裝命令及提示詞複製、手機版與 404，使用者已表示滿意並明確批准進入第二批。

## 第二批：已實作、完成本機驗證，等待使用者驗收

### 已完成內容
- 收錄由 8 個公開 GitHub 倉庫核對的 **117 個 SKILL.md**，含檔案路徑、來源 SHA、作者的 YAML 名稱／說明及來源核對日期。
- 117 個中文編輯條目（名稱、用途、場景、提示詞、注意事項）。這是 AI 協助整理的編輯稿，尚未取得原作者授權翻譯或獨立人工全文審稿。
- 身份鍵使用 `owner/repo/slug`，支援跨倉庫同名 Skill 的不同網址；命令讀取原始 frontmatter `name`，避免檔案夾名稱與安裝名不一致。
- 詳細頁提供直接的原始 GitHub `SKILL.md` URL、SHA 節錄及最近核對日期；若 SHA 更新，顯示「中文說明待複核」。
- `npm run sync:skills`：維護者從 GitHub REST API 核對白名單來源；對 SHA 未改的項目重用資料、修改時重新讀取 blob；整批驗證後才取代快照，任何網絡失敗／來源缺失／中文缺漏均保留原快照。
- `npm run catalog:localize`：把已編輯的 TSV 轉為 JSON，不會偷偷改動原文 SHA 的審核指標。
- `npm run qa:e2e`：使用本機 Chrome 的 Playwright 檢查搜尋、分類、來源頁連結、複製、404 及版面。
- 原有搜尋和 UI 流程保留，未操作使用者的 Codex／Cursor／Claude Code。

### 測試與證據
- `npm run test`：29/29 通過，包括來源唯一性、同名 Skill、缺來源、中文缺漏、SHA 變化、網路失敗回退、搜尋。
- `npm run typecheck`、`npm run lint`：通過。
- `npm run build`：正式建置通過，產生 117 個 Skill 詳細路由（全部共 123 頁）。
- 實際 GitHub 更新：`npm run sync:skills` 成功，**117 項 SHA 不變且 cached=117、changed=0、new=0**；來源核對時間已更新。未聲稱所有檔案都重新下載。
- 瀏覽器端到端：390px／1440px 無橫向溢出；搜尋「React」有 6 個結果、文件與辦公分類有 10 個結果；React Skill 原始連結指向對應 SKILL.md；複製 `npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices` 與示例成功；未收錄的頁面 HTTP 404；無頁面例外。
- 瀏覽器截圖（本機）：`docs/qa-phase2-mobile.png`、`docs/qa-phase2-desktop.png`、`docs/qa-phase2-detail.png`（不追蹤進 Git）。

### 使用者驗收操作
1. 在本機開啟 `http://127.0.0.1:3026`，確認首頁顯示 **117 個**，搜尋「React」及中文分類。
2. 開啟 `/skills/react-best-practices`，確認 SHA、原始指引與使用教學，複製安裝命令。
3. 在 PowerShell 進入專案，執行 `npm run sync:skills`，檢查 cached/changed/new 與來源核對日期。
4. 手機寬度下瀏覽頁面，確認清單和導航沒有橫向溢出。

### 待驗證／未納入本批
- 所有第三方 Skill 的**實際安裝效果、安全性**未逐一審計；來源存在不等於可安全執行。
- 中文內容由 AI 輔助編輯，尚未完成原作者確認或完整獨立人工內容審稿。
- skills.sh 官方需 Vercel OIDC 的 API 沒有接入，不顯示實時安裝量、安全評分或排行榜。
- 尚未自動排程同步；目前由維護者手動執行。GitHub 匿名 API 有速率限制，必要時使用私人環境變數 Token。
- 尚未公開部署網站；未進行真實用戶驗收或全平台兼容測試。

## 下一批（需使用者再次驗收與批准）
- R09：中文自然語言需求 → Skill 相關性推薦（先評估非 AI 方案）。
- R10：簡體／繁體切換。
- 視需要補充人工審核流程、更穩健的來源同步和正式部署評估。

## 第三批（2026-11-03）

狀態：已實作並完成本機測試，等待使用者驗收。工作分支：`feat/phase3-natural-discovery`。

### 成果
- R09 自然語言尋找 Skill：首頁提供需求描述、理由、空結果；免費本機意圖匹配，不冒充 LLM。
- R10 繁簡切換：使用 opencc-js，保留本機偏好，兩種中文均可搜尋；原始 Skill name／安裝指令不修改。
- R11 GitHub 候選發現：`/discoveries` 展示首批 20 個手動核對 GitHub 來源的新候選，與原有 117 個正式 Skill 分開。獨立 CLI 定期掃描 GitHub 公開倉庫及 SKILL.md、檢查去重、失敗不覆蓋舊快照。
- R12 每週更新：Windows Task Scheduler `Skill Atlas Weekly Discovery` 已成功登記、Ready，週一 09:17 UTC+8，下次 2026-11-09；另附 GitHub Actions 每週 PR 工作流程，因尚無遠端倉庫而**未啟用**。

### 測試
- 新增自然語言意圖匹配、繁簡轉換和候選發現核心測試；完整測試按 `npm run test`。
- 實際 Chrome／Playwright `npm run qa:phase3`：自然語言推薦及不相干空結果、簡體切換與刷新持久化、簡體搜尋、詳細頁中文、安裝命令不變、簡體提示詞複製、20 個候選安全隔離、404、390px 手機與 1440px 桌面，均通過。
- GitHub 匿名 REST API 首次發現回應速率限制，CLI 正確失敗且沒有覆蓋舊資料。使用 GitHub 連接工具核對 20 個新候選的真實檔案路徑；不是聲稱匿名批量掃描成功。
- Windows 每週排程已登記，但第一次正式每週執行時間尚未到，不能宣稱已跑過正式排程。

### 尚未完成
- 無法保證 GitHub 全量 Skill 收錄；搜尋受 GitHub 倉庫索引、速率限制與查詢涵蓋範圍限制。
- 新發現項目尚未經中文內容、安全性和授權審查，因此不會自動加入正式 117 條目，也不向用戶提供未審核的安裝指令。
- GitHub Actions 需先將 workflow 提交至已設定預設分支的遠端倉庫，且授予建立 PR 權限；本機沒有已配置的 Git remote，未啟用雲端自動化。
- Windows 排程受電腦開機、網路、Node.js 環境和 GitHub API 限額影響。
