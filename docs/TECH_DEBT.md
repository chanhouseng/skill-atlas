# 技集｜已知風險與技術債

- **資料覆蓋率（產品限制，不是 Bug）：** 第一批手工核對的精選項目尚未覆蓋全體 skills.sh Skill；第二批擴至 100 並增量更新。
- **即時資料同步（未實作）：** skills.sh API 按官方文件要求 Vercel OIDC；本機第一批不保存憑據、不展示即時安裝量與審計分數。
- **第三方安全性（未驗證）：** 中文使用指南不能取代審核 SKILL.md 或下載資源的安全性，網站需要明確顯示。
- **同名 Skill（待擴展）：** 第一批以 Skill 名稱唯一 slug；大量導入前需改為來源＋名稱組合唯一 ID。
- **BUG-001（已解決）：** Next.js 16 Cache Components 在 `/skills/[slug]` 直接取得 `params` 時，開發日誌提示可能延遲切頁；把內容放入 Suspense 雖避免警告，卻使未知網址的 HTTP 狀態變成 200。最終使用該路由的 `export const instant = false`，避免錯誤串流狀態；已用真實 HTTP 驗證存在的 Skill 為 200、未收錄網址為 404，並再次通過建置與瀏覽器互動測試。

- **套件安全提示（2026-11-03）：** `npm audit` 報告 16 項 moderate，均與 ESLint／TypeScript ESLint 及其依賴有關；`npm audit --omit=dev` 報告 0 項。第一批不執行可能帶入破壞性更新的 `npm audit fix --force`，下批應查明上游修補版本並重新測試。
