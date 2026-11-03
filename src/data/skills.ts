export const categories = [
  "網頁與視覺設計",
  "程式開發",
  "測試與品質",
  "Agent 與自動化",
  "文件與辦公",
  "影音與創作",
  "學習與協作",
  "Skill 工具"
] as const;

export type SkillCategory = (typeof categories)[number];

export interface Skill {
  slug: string;
  zhName: string;
  summary: string;
  category: SkillCategory;
  source: string;
  tags: string[];
  scenarios: string[];
  examplePrompt: string;
  caution: string;
  featured: boolean;
}

// 本站人工編輯的中文摘要；項目名稱與來源來自公開 Skill 倉庫／skills.sh。
// 不代表官方翻譯或第三方安全審查；詳情以原始 SKILL.md 為準。
export const skills: Skill[] = [
  {
    "slug": "landing-page-design",
    "zhName": "Landing Page 設計",
    "summary": "用結構化方法規劃產品介紹頁的內容、排版、字體、間距與動效。",
    "category": "網頁與視覺設計",
    "source": "elayadesign/ai-design-skills",
    "tags": [
      "首頁",
      "視覺規範",
      "轉化設計"
    ],
    "scenarios": [
      "新建產品介紹頁",
      "制定首頁排版與 CTA",
      "統一字體及動畫規範"
    ],
    "examplePrompt": "請使用 landing-page-design，為我的中文 AI 工具建立首頁。目標讀者是大學生，主要行動是查看功能。先給頁面結構，再完成響應式頁面，避免虛構用戶評價。",
    "caution": "它有固定設計偏好；若已有品牌系統，應明確告訴 AI 保留原有規範。",
    "featured": true
  },
  {
    "slug": "figma-designer",
    "zhName": "Figma 設計系統",
    "summary": "以可編輯元件與設計變數規劃 Figma 畫面，重視 Auto Layout 和狀態管理。",
    "category": "網頁與視覺設計",
    "source": "elayadesign/ai-design-skills",
    "tags": [
      "Figma",
      "元件",
      "設計系統"
    ],
    "scenarios": [
      "建立 Figma 組件庫",
      "整理間距與顏色變數",
      "建立按鈕狀態"
    ],
    "examplePrompt": "請使用 figma-designer，為一個深藍色的學習 App 設計首頁與元件庫。請用 Auto Layout，建立顏色與間距變數，保留所有畫面可編輯。",
    "caution": "在 Figma 實際寫入需要相應工具連線；僅安裝 Skill 不等於能控制 Figma。",
    "featured": false
  },
  {
    "slug": "frontend-design",
    "zhName": "前端視覺設計",
    "summary": "幫助 AI 做出具有辨識度的網頁，從設計方向、文字層級到可用介面。",
    "category": "網頁與視覺設計",
    "source": "anthropics/skills",
    "tags": [
      "UI",
      "前端",
      "美化"
    ],
    "scenarios": [
      "設計有特色的網站",
      "改善視覺層次",
      "製作符合品牌的頁面"
    ],
    "examplePrompt": "請使用 frontend-design，為中文 Skill 目錄設計首頁。希望資訊查找優先、偏專業編輯式排版。先說明視覺方向，再提供可運行程式碼。",
    "caution": "請提供目標用戶與喜歡的風格，否則視覺方向可能不合預期。",
    "featured": true
  },
  {
    "slug": "web-design-guidelines",
    "zhName": "網頁設計規範檢查",
    "summary": "依照網頁介面原則檢查已有前端的可用性、可讀性與交互品質。",
    "category": "網頁與視覺設計",
    "source": "vercel-labs/agent-skills",
    "tags": [
      "審查",
      "可用性",
      "網頁"
    ],
    "scenarios": [
      "審查現有介面",
      "尋找交互問題",
      "改善可讀性"
    ],
    "examplePrompt": "請使用 web-design-guidelines 審查目前網站。請指出有證據的可用性問題、檔案位置與優先級，先提供審查結果，不要直接重寫整個頁面。",
    "caution": "這是審查指引，不等於瀏覽器自動化測試已完成。",
    "featured": false
  },
  {
    "slug": "design-mobile-apps",
    "zhName": "行動 App 介面設計",
    "summary": "聚焦手機應用的視覺與交互設計，協助規劃更完整的操作流程。",
    "category": "網頁與視覺設計",
    "source": "designed-by-ai/skills",
    "tags": [
      "APP",
      "手機",
      "UI"
    ],
    "scenarios": [
      "設計手機首頁",
      "優化操作流程",
      "建立行動端元件"
    ],
    "examplePrompt": "請使用 design-mobile-apps，為我的 Android 專注計時 App 設計首頁、時間表、專注、我的四個主要頁面，優先操作簡單與易於閱讀。",
    "caution": "設計建議不會自動生成 Android 原生可用程式。",
    "featured": false
  },
  {
    "slug": "design-taste-frontend",
    "zhName": "高辨識度前端風格",
    "summary": "以審美與視覺品質為重點，引導 AI 避免常見的模板化介面。",
    "category": "網頁與視覺設計",
    "source": "leonxlnx/taste-skill",
    "tags": [
      "美學",
      "品牌",
      "前端"
    ],
    "scenarios": [
      "打造特色展示頁",
      "調整字體與節奏",
      "改善同質化設計"
    ],
    "examplePrompt": "請使用 design-taste-frontend 改善我的網站視覺。保持功能與文案不變，提出具辨識度的配色、字級和布局，完成前後比較。",
    "caution": "風格提升應服從可訪問性和原本產品需求。",
    "featured": false
  },
  {
    "slug": "canvas-design",
    "zhName": "平面與視覺作品設計",
    "summary": "為海報、靜態視覺等提供構圖、風格和內容層級的設計流程。",
    "category": "網頁與視覺設計",
    "source": "anthropics/skills",
    "tags": [
      "平面",
      "海報",
      "視覺"
    ],
    "scenarios": [
      "活動海報",
      "圖文排版",
      "視覺構圖"
    ],
    "examplePrompt": "請使用 canvas-design，設計一張中文 AI 工具分享會海報。畫面以深藍和白色為主，強調時間與地點的可讀性，並保留活動名稱的主視覺。",
    "caution": "這個 Skill 的用途是視覺設計，不能代替印刷出血與輸出規格檢查。",
    "featured": false
  },
  {
    "slug": "theme-factory",
    "zhName": "主題風格套用",
    "summary": "協助為文件、展示或介面建立一致的字體、顏色與視覺主題。",
    "category": "網頁與視覺設計",
    "source": "anthropics/skills",
    "tags": [
      "主題",
      "風格",
      "一致性"
    ],
    "scenarios": [
      "統一簡報主題",
      "套用文件配色",
      "建立整體視覺風格"
    ],
    "examplePrompt": "請使用 theme-factory，為這份產品展示採用深藍與青綠色的專業主題，保持內容不變，統一標題、間距和圖表配色。",
    "caution": "先指定品牌色，避免主題覆蓋原有的品牌要求。",
    "featured": false
  },
  {
    "slug": "web-artifacts-builder",
    "zhName": "互動網頁作品製作",
    "summary": "協助製作包含互動邏輯的網頁展示與前端作品。",
    "category": "網頁與視覺設計",
    "source": "anthropics/skills",
    "tags": [
      "React",
      "互動",
      "網頁"
    ],
    "scenarios": [
      "互動產品 Demo",
      "單頁展示",
      "可操作原型"
    ],
    "examplePrompt": "請使用 web-artifacts-builder，製作一個可互動的專注計時原型。包含開始、暫停和結束狀態，鍵盤可操作，先確保功能再調整樣式。",
    "caution": "原型不等於可上線的安全產品，仍需測試。",
    "featured": false
  },
  {
    "slug": "brand-guidelines",
    "zhName": "品牌規範套用",
    "summary": "在內容與設計作品中維持既有品牌色彩、字體與風格一致。",
    "category": "網頁與視覺設計",
    "source": "anthropics/skills",
    "tags": [
      "品牌",
      "視覺規範",
      "標識"
    ],
    "scenarios": [
      "品牌簡報",
      "產品介紹",
      "統一視覺輸出"
    ],
    "examplePrompt": "請使用 brand-guidelines，根據我提供的品牌色與字體要求調整網站首頁，保留 Logo 不變並輸出所用的設計規範。",
    "caution": "請提供真實品牌規範，不要讓 AI 自行杜撰品牌手冊。",
    "featured": false
  },
  {
    "slug": "vercel-react-best-practices",
    "zhName": "React 效能最佳實踐",
    "summary": "使用 React 與 Next.js 的最佳實踐指引改善效能與實作方式。",
    "category": "程式開發",
    "source": "vercel-labs/agent-skills",
    "tags": [
      "React",
      "Next.js",
      "效能"
    ],
    "scenarios": [
      "改善 React 效能",
      "審查渲染模式",
      "優化前端結構"
    ],
    "examplePrompt": "請使用 vercel-react-best-practices 檢查目前 Next.js 頁面。優先找出不必要的客戶端渲染與資料載入問題，提供原因、修改和驗證方法。",
    "caution": "最佳實踐需結合實測數據，不保證每次重構一定加快。",
    "featured": true
  },
  {
    "slug": "codebase-design",
    "zhName": "程式碼架構設計",
    "summary": "協助規劃程式結構、模組邊界和可維護的程式碼組織方式。",
    "category": "程式開發",
    "source": "mattpocock/skills",
    "tags": [
      "架構",
      "模組",
      "設計"
    ],
    "scenarios": [
      "新功能架構",
      "大型專案整理",
      "模組拆分"
    ],
    "examplePrompt": "請使用 codebase-design，閱讀現有 Next.js 專案後設計 Skill 資料同步模組。先提出模組界線和資料流，保留已有搜尋功能。",
    "caution": "先閱讀現有程式碼再設計，避免不必要的架構重寫。",
    "featured": false
  },
  {
    "slug": "improve-codebase-architecture",
    "zhName": "改善既有程式架構",
    "summary": "幫助識別程式庫架構上的問題，逐步整理模組依賴與邊界。",
    "category": "程式開發",
    "source": "mattpocock/skills",
    "tags": [
      "重構",
      "架構",
      "品質"
    ],
    "scenarios": [
      "降低耦合",
      "整理依賴",
      "建立重構計劃"
    ],
    "examplePrompt": "請使用 improve-codebase-architecture 審查這個 Node.js 專案。先列出風險和可驗證改善，再分小批重構，確保 API 行為不變。",
    "caution": "重構前應有測試保護，不能只憑程式碼外觀判斷效益。",
    "featured": false
  },
  {
    "slug": "domain-modeling",
    "zhName": "領域模型設計",
    "summary": "從產品概念出發建立清楚的資料與業務模型，減少規則混亂。",
    "category": "程式開發",
    "source": "mattpocock/skills",
    "tags": [
      "領域建模",
      "資料",
      "業務"
    ],
    "scenarios": [
      "定義 Skill 資料結構",
      "梳理業務狀態",
      "設計資料關係"
    ],
    "examplePrompt": "請使用 domain-modeling，為中文 Skill 目錄整理 Skill、來源、翻譯和更新紀錄的資料模型。先解釋實體及關係，再提供 TypeScript 型別。",
    "caution": "領域模型應根據已確認的業務需求而非未來猜測設計。",
    "featured": false
  },
  {
    "slug": "implement",
    "zhName": "按計劃實作功能",
    "summary": "根據已有的需求或實作計劃執行編程工作並追蹤驗收。",
    "category": "程式開發",
    "source": "mattpocock/skills",
    "tags": [
      "實作",
      "任務",
      "交付"
    ],
    "scenarios": [
      "按 PRD 開發",
      "完成小批任務",
      "落實驗收"
    ],
    "examplePrompt": "請使用 implement，按 docs/PRD.md 實作本批已確認的搜尋功能。不要擴展範圍，完成後報告修改檔案與測試結果。",
    "caution": "需要明確的範圍與可驗收條件。",
    "featured": false
  },
  {
    "slug": "triage",
    "zhName": "問題優先級整理",
    "summary": "協助整理回報、辨認問題範圍與決定處理順序。",
    "category": "測試與品質",
    "source": "mattpocock/skills",
    "tags": [
      "Bug",
      "分流",
      "優先級"
    ],
    "scenarios": [
      "回報分類",
      "問題排序",
      "制定排查順序"
    ],
    "examplePrompt": "請使用 triage，整理這 12 條網站問題回報，區分功能錯誤、體驗問題與需求建議，按影響和重現性排序。",
    "caution": "問題分級不是已經完成修復。",
    "featured": false
  },
  {
    "slug": "tdd",
    "zhName": "測試驅動開發",
    "summary": "協助以先寫測試再實作的方式完成需求，減少回歸錯誤。",
    "category": "測試與品質",
    "source": "mattpocock/skills",
    "tags": [
      "測試",
      "TDD",
      "程式開發"
    ],
    "scenarios": [
      "新功能測試",
      "先驗收再寫功能",
      "改善回歸風險"
    ],
    "examplePrompt": "請使用 tdd，為 Skill 搜尋函式先建立失敗測試，涵蓋中文、英文與空查詢，再實作最小程式碼使測試通過。",
    "caution": "TDD 不會取代整合測試與使用者驗收。",
    "featured": true
  },
  {
    "slug": "diagnosing-bugs",
    "zhName": "系統化診斷 Bug",
    "summary": "先收集證據與重現問題，再定位原因，避免直接猜測修復。",
    "category": "測試與品質",
    "source": "mattpocock/skills",
    "tags": [
      "除錯",
      "定位",
      "診斷"
    ],
    "scenarios": [
      "重現錯誤",
      "定位例外",
      "分析不穩定行為"
    ],
    "examplePrompt": "請使用 diagnosing-bugs，分析搜尋欄輸入中文後結果消失的問題。先重現並記錄證據，定位原因後做最小修復與回歸測試。",
    "caution": "未能重現時要保留不確定性，不能虛報已找到根因。",
    "featured": false
  },
  {
    "slug": "code-review",
    "zhName": "程式碼審查",
    "summary": "根據變更內容檢查正確性、可維護性與潛在風險。",
    "category": "測試與品質",
    "source": "mattpocock/skills",
    "tags": [
      "審查",
      "品質",
      "程式"
    ],
    "scenarios": [
      "PR 審查",
      "合併前檢查",
      "識別風險"
    ],
    "examplePrompt": "請使用 code-review 審查最近一次提交，只指出可重現或有證據的問題，按嚴重程度排序，附檔案位置和驗證步驟。",
    "caution": "審查建議需要可核查的證據。",
    "featured": false
  },
  {
    "slug": "webapp-testing",
    "zhName": "網頁應用測試",
    "summary": "協助使用瀏覽器自動化方法驗證網頁功能與使用流程。",
    "category": "測試與品質",
    "source": "anthropics/skills",
    "tags": [
      "Playwright",
      "網頁",
      "測試"
    ],
    "scenarios": [
      "測試表單",
      "測試導覽",
      "回歸檢查"
    ],
    "examplePrompt": "請使用 webapp-testing 測試首頁搜尋、分類、詳細頁和複製按鈕。驗證桌面與手機尺寸，提供失敗畫面及重現步驟。",
    "caution": "需要實際可操作的瀏覽器／測試工具。",
    "featured": false
  },
  {
    "slug": "agent-browser",
    "zhName": "Agent 瀏覽器操作",
    "summary": "提供 AI Agent 以程式操作瀏覽器、完成網站流程的指引與工具。",
    "category": "Agent 與自動化",
    "source": "vercel-labs/agent-browser",
    "tags": [
      "瀏覽器",
      "自動化",
      "Agent"
    ],
    "scenarios": [
      "瀏覽器流程",
      "網站資料提取",
      "操作驗收"
    ],
    "examplePrompt": "請使用 agent-browser，打開本機網站並檢查搜尋欄、分類與詳細頁。每一步記錄實際結果，不要假設點擊成功。",
    "caution": "瀏覽器自動化依賴工具與網站授權，不應繞過登入與安全限制。",
    "featured": true
  },
  {
    "slug": "mcp-builder",
    "zhName": "MCP 工具伺服器開發",
    "summary": "指導建立讓 AI 連接外部 API 和服務的 MCP 工具。",
    "category": "Agent 與自動化",
    "source": "anthropics/skills",
    "tags": [
      "MCP",
      "API",
      "工具"
    ],
    "scenarios": [
      "建立 MCP Server",
      "連接外部 API",
      "設計工具介面"
    ],
    "examplePrompt": "請使用 mcp-builder，為我設計一個只讀的 GitHub Skill 查詢 MCP 伺服器。先定義工具輸入輸出、錯誤處理與權限，再實作測試。",
    "caution": "接入外部帳號時要明確控制權限與金鑰。",
    "featured": false
  },
  {
    "slug": "claude-api",
    "zhName": "Claude API 開發",
    "summary": "協助使用 Claude API 或相關 SDK 建立 AI 應用與整合。",
    "category": "Agent 與自動化",
    "source": "anthropics/skills",
    "tags": [
      "Claude",
      "API",
      "SDK"
    ],
    "scenarios": [
      "模型 API 整合",
      "串接 SDK",
      "處理模型回覆"
    ],
    "examplePrompt": "請使用 claude-api，為 Node.js 專案設計一個可測試的模型問答服務，從環境變數讀取金鑰，不將金鑰提交到 Git。",
    "caution": "要核對 SDK 與 API 最新版本及費用。",
    "featured": false
  },
  {
    "slug": "find-skills",
    "zhName": "尋找合適的 Skill",
    "summary": "幫你搜尋與任務相關的 Skill，並判斷哪個更適用。",
    "category": "Skill 工具",
    "source": "vercel-labs/skills",
    "tags": [
      "搜尋",
      "安裝",
      "發現"
    ],
    "scenarios": [
      "找設計 Skill",
      "尋找測試工具",
      "比較技能來源"
    ],
    "examplePrompt": "請使用 find-skills，幫我找可以從網站截圖提取版面與動效規範的 Skill。請給出來源、適用場景與安裝指令。",
    "caution": "搜尋結果只代表候選，不代表每個 Skill 都安全或可靠。",
    "featured": true
  },
  {
    "slug": "skill-creator",
    "zhName": "建立與改進 Skill",
    "summary": "指導撰寫、測試與迭代 Skill 的 SKILL.md，提升觸發準確性。",
    "category": "Skill 工具",
    "source": "anthropics/skills",
    "tags": [
      "Skill",
      "建立",
      "測試"
    ],
    "scenarios": [
      "編寫自訂 Skill",
      "改善觸發描述",
      "驗證效果"
    ],
    "examplePrompt": "請使用 skill-creator，為我建立一個網站動畫分析 Skill。先定義觸發條件、輸入輸出與驗收案例，再產生 SKILL.md 並檢查。",
    "caution": "發布前仍需人工核對指引與安全性。",
    "featured": false
  },
  {
    "slug": "pdf",
    "zhName": "PDF 處理",
    "summary": "幫助建立、閱讀與編輯 PDF 文件，並檢查內容與排版。",
    "category": "文件與辦公",
    "source": "anthropics/skills",
    "tags": [
      "PDF",
      "文件",
      "閱讀"
    ],
    "scenarios": [
      "製作 PDF",
      "讀取頁面",
      "格式處理"
    ],
    "examplePrompt": "請使用 pdf Skill，將我提供的研究摘要排成 A4 PDF，保留標題層級與參考文獻，最後檢查每頁是否有文字溢出。",
    "caution": "涉及掃描文件時可能需要額外文字識別流程。",
    "featured": false
  },
  {
    "slug": "docx",
    "zhName": "Word 文件處理",
    "summary": "協助建立與調整 DOCX 文件的結構、表格與版面格式。",
    "category": "文件與辦公",
    "source": "anthropics/skills",
    "tags": [
      "Word",
      "DOCX",
      "文件"
    ],
    "scenarios": [
      "生成報告",
      "修改排版",
      "編輯 Word"
    ],
    "examplePrompt": "請使用 docx Skill，把這份報告整理成正式 Word 文件，包含標題、摘要和參考文獻，內容不要擅自改寫。",
    "caution": "保留原檔備份；大型排版修改要檢查實際渲染。",
    "featured": false
  },
  {
    "slug": "xlsx",
    "zhName": "Excel 試算表處理",
    "summary": "處理試算表資料、公式與格式，製作可編輯的工作簿。",
    "category": "文件與辦公",
    "source": "anthropics/skills",
    "tags": [
      "Excel",
      "XLSX",
      "表格"
    ],
    "scenarios": [
      "整理數據",
      "設計時間表",
      "建立公式"
    ],
    "examplePrompt": "請使用 xlsx Skill，製作可編輯的每週學習時間表，包含日期、時段、科目和專注時數統計，檢查每個公式。",
    "caution": "複雜公式仍須用實際數據驗證。",
    "featured": false
  },
  {
    "slug": "pptx",
    "zhName": "PowerPoint 製作",
    "summary": "協助撰寫與排版簡報，建立結構化的投影片內容。",
    "category": "文件與辦公",
    "source": "anthropics/skills",
    "tags": [
      "PPT",
      "簡報",
      "投影片"
    ],
    "scenarios": [
      "課堂簡報",
      "產品展示",
      "整理演講材料"
    ],
    "examplePrompt": "請使用 pptx Skill，把這份產品需求整理成 8 張簡報，突出問題、方案、技術和驗收，每頁控制文字量並檢查元素有否超出。",
    "caution": "不能僅依文稿推斷圖表數據，仍須核對來源。",
    "featured": false
  },
  {
    "slug": "doc-coauthoring",
    "zhName": "協作撰寫文件",
    "summary": "透過結構化討論與審查流程，共同完成需求文檔及長篇寫作。",
    "category": "文件與辦公",
    "source": "anthropics/skills",
    "tags": [
      "PRD",
      "寫作",
      "協作"
    ],
    "scenarios": [
      "撰寫 PRD",
      "修改長文件",
      "整理規格"
    ],
    "examplePrompt": "請使用 doc-coauthoring，根據已確認需求整理中文網站 PRD。區分已確認事項與建議，包含流程、非目標與可驗收條件。",
    "caution": "避免把尚未決定的功能寫成已確認需求。",
    "featured": false
  },
  {
    "slug": "remotion-best-practices",
    "zhName": "程式化影片製作",
    "summary": "使用 Remotion 的開發規範設計可由程式控制的影片。",
    "category": "影音與創作",
    "source": "remotion-dev/skills",
    "tags": [
      "Remotion",
      "React",
      "影片"
    ],
    "scenarios": [
      "動畫短片",
      "資料驅動影片",
      "程式剪輯"
    ],
    "examplePrompt": "請使用 remotion-best-practices，以 React 與 Remotion 製作 5 秒循環網站背景動畫。保持文字清晰，輸出可執行專案與渲染命令。",
    "caution": "需要實際渲染與時間軸檢查，不能只靠靜態截圖。",
    "featured": false
  },
  {
    "slug": "hyperframes-animation",
    "zhName": "影片動畫工作流程",
    "summary": "為 Hyperframes 相關動畫流程提供具體的動效製作指引。",
    "category": "影音與創作",
    "source": "heygen-com/hyperframes",
    "tags": [
      "動畫",
      "影片",
      "Hyperframes"
    ],
    "scenarios": [
      "影片特效",
      "動畫鏡頭",
      "創作流程"
    ],
    "examplePrompt": "請使用 hyperframes-animation，針對我的 5 秒產品短片設計平滑轉場方案。先說明可達到的效果、所需素材與輸出格式。",
    "caution": "可能依賴特定工具或服務，需先確認可用性。",
    "featured": false
  },
  {
    "slug": "slack-gif-creator",
    "zhName": "聊天 GIF 動畫",
    "summary": "協助製作適合聊天與協作工具使用的簡短 GIF 動畫。",
    "category": "影音與創作",
    "source": "anthropics/skills",
    "tags": [
      "GIF",
      "動畫",
      "Slack"
    ],
    "scenarios": [
      "團隊表情",
      "短動畫",
      "訊息素材"
    ],
    "examplePrompt": "請使用 slack-gif-creator，製作一個簡單的成功提示 GIF，主題是完成程式建置，讓動作循環自然並控制檔案大小。",
    "caution": "請確認輸出的尺寸與檔案限制是否符合目標平台。",
    "featured": false
  },
  {
    "slug": "algorithmic-art",
    "zhName": "演算法視覺藝術",
    "summary": "透過程式生成圖形、圖案和實驗性視覺作品。",
    "category": "影音與創作",
    "source": "anthropics/skills",
    "tags": [
      "生成藝術",
      "程式",
      "圖形"
    ],
    "scenarios": [
      "創作程序藝術",
      "動態背景",
      "幾何圖案"
    ],
    "examplePrompt": "請使用 algorithmic-art，寫一個可重現的粒子流場視覺作品。提供固定隨機種子與可調參數，避免引用外部受版權限制圖片。",
    "caution": "生成作品仍需檢查效能與裝置相容性。",
    "featured": false
  },
  {
    "slug": "teach",
    "zhName": "循序漸進教學",
    "summary": "按照學習者水平逐步講解技術概念，並透過例子確認理解。",
    "category": "學習與協作",
    "source": "mattpocock/skills",
    "tags": [
      "教學",
      "入門",
      "解釋"
    ],
    "scenarios": [
      "理解程式概念",
      "逐步教學",
      "學習新技術"
    ],
    "examplePrompt": "請使用 teach，用大一程度教我 Java 的 HashMap。先解釋它是甚麼、為何需要，再給可執行例子與兩題練習，不要跳步。",
    "caution": "應說明學習者的基礎與目標。",
    "featured": false
  },
  {
    "slug": "grill-me",
    "zhName": "深入追問與需求檢視",
    "summary": "透過連續問題檢查方案是否完整，發現未釐清的關鍵假設。",
    "category": "學習與協作",
    "source": "mattpocock/skills",
    "tags": [
      "提問",
      "思考",
      "驗證"
    ],
    "scenarios": [
      "需求訪談",
      "設計評估",
      "方案質詢"
    ],
    "examplePrompt": "請使用 grill-me，站在產品經理角度檢視我的中文 Skill 網站想法。每次只問一個關鍵問題，幫我找出未解決的需求與限制。",
    "caution": "適合討論階段，急需實作時可直接提供明確任務。",
    "featured": false
  },
  {
    "slug": "handoff",
    "zhName": "工作交接",
    "summary": "幫助將工作背景、已完成事項和下一步整理成可以接手的內容。",
    "category": "學習與協作",
    "source": "mattpocock/skills",
    "tags": [
      "交接",
      "進度",
      "協作"
    ],
    "scenarios": [
      "換 AI 工作階段",
      "團隊交接",
      "移交任務"
    ],
    "examplePrompt": "請使用 handoff，將目前專案的已完成工作、已確認需求、待辦事項、相關檔案及驗收情況整理成一份可交給另一位開發者的交接說明。",
    "caution": "交接資料須核對實際檔案，避免把計劃寫成完成。",
    "featured": false
  },
  {
    "slug": "prototype",
    "zhName": "快速製作原型",
    "summary": "把想法轉成可試用的原型，用來驗證方向和交互。",
    "category": "學習與協作",
    "source": "mattpocock/skills",
    "tags": [
      "原型",
      "驗證",
      "實驗"
    ],
    "scenarios": [
      "產品 MVP",
      "快速 Demo",
      "交互實驗"
    ],
    "examplePrompt": "請使用 prototype，為一個中文 Skill 目錄製作可點擊首頁原型。只驗證搜尋、分類和詳細頁流程，暫不連線任何帳號。",
    "caution": "原型不等於生產環境版本，也不能當成正式安全驗收。",
    "featured": false
  }
];

export function getSkillBySlug(slug: string): Skill | undefined {
  return skills.find((skill) => skill.slug === slug);
}
export function installCommand(skill: Skill): string {
  return `npx skills add ${skill.source} --skill ${skill.slug}`;
}
export function skillsShUrl(skill: Skill): string {
  return `https://skills.sh/${skill.source}/${skill.slug}`;
}
export function githubUrl(skill: Skill): string {
  return `https://github.com/${skill.source}`;
}
