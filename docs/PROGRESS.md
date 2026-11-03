# 技集開發進度

## 第一批（2026-11-03）

**狀態：** 已實作並完成本機自動驗證，等待使用者驗收。依全域 AGENTS.md，驗收前不繼續第二批。

### 已交付
- Next.js + TypeScript + Tailwind 本機網站，可於 `http://127.0.0.1:3026` 開啟。
- 38 個有真實來源的 Skill：中文名稱、摘要、分類、場景、提示詞範例、注意事項。
- 8 個分類、即時中英文關鍵字搜尋、編輯精選、顯示更多、空結果。
- Skill 詳細頁、安裝指令與提示詞複製、原始 GitHub 與 skills.sh 連結。
- 使用指南、手機版版面、未知 URL 的 404。

### 驗證結果（2026-11-03）
- `npm run test`：7/7 通過。
- `npm run typecheck`：通過。
- `npm run lint`：通過。
- `npm run build`：通過，首頁與 38 個 Skill 詳細頁已預渲染／部分預渲染。
- 本機 HTTP：首頁 200；兩個 Skill 詳細頁 200；關於頁 200；不存在的 Skill 返回真正的 HTTP 404（已修正 Next.js 16 路由警告及狀態碼問題）。
- Chrome + Playwright（真實瀏覽器）：390px 手機視窗與 1440px 桌面均無橫向溢出。
- Playwright：React 搜尋取得 3 個結果、手機版「文件與辦公」分類得到 5 個結果；進入 PDF 詳細頁並成功複製 `npx skills add anthropics/skills --skill pdf`；404 文字正常。
- 截圖證據：`docs/qa-mobile-playwright.png`、`docs/qa-desktop-playwright.png`、`docs/qa-detail-playwright.png`。

### 未完成／未驗證
- 目錄尚未擴展到 100 條；未接入 skills.sh OIDC API、GitHub 增量同步、網站部署、智能需求推薦、繁簡切換。
- 未測所有第三方 Skill 的安裝，也未做第三方安全審查。
- 外部 API／倉庫來源有變更時，第一批靜態資料不會即時更新。

### 使用者驗收
1. 在本機 Chrome 開啟 `http://127.0.0.1:3026`；搜尋「React」並按類別篩選。
2. 打開任意 Skill 詳細頁；複製安裝命令與調用示例；核對來源連結。
3. 在 390px 手機寬度或 Chrome 裝置模式瀏覽。

### 下一批（未經使用者驗收前不自動開始）
- 擴展約 100 個有核對來源的中文 Skill。
- 設計來源同步、版本與授權方案；需要憑據時先確認使用者權限。
