import type { Skill } from "./catalog.ts";

// These are descriptions only. Skill files remain on the user's own computer.
export const localSkills: Skill[] = [
  {
    id:"local/website-style-blueprint-extractor",sourceKind:"local",source:"本機 Skill",slug:"website-style-blueprint-extractor",name:"website-style-blueprint-extractor",path:"",sha:"",description:"Turn website references into reusable generation prompts.",routeSlug:"website-style-blueprint-extractor",sourceFileUrl:"",needsReview:false,verifiedAt:"",reviewedSha:"",
    zhName:"網站風格藍圖提取",summary:"從網站範本、設計描述或程式碼整理可重用的版面與風格，產生完整建站提示詞。",category:"網頁與視覺設計",scenarios:["把網站範本整理為可重用的設計規格","保留頁面佈局和互動方式，換成自己的內容"],examplePrompt:"請使用 website-style-blueprint-extractor，把以下網站範本整理成獨立的網站生成提示詞，保留佈局、色彩與響應式規則，換掉原品牌內容。",caution:"此 Skill 僅有本機版本，本站不提供下載或安裝；請在已安裝的 AI 工具中使用。",tags:["網站風格","設計藍圖","提示詞"],featured:false
  },
  {
    id:"local/screenshot-to-website-prompt",sourceKind:"local",source:"本機 Skill",slug:"screenshot-to-website-prompt",name:"screenshot-to-website-prompt",path:"",sha:"",description:"Turn website or app screenshots into a reusable website generation prompt.",routeSlug:"screenshot-to-website-prompt",sourceFileUrl:"",needsReview:false,verifiedAt:"",reviewedSha:"",
    zhName:"截圖轉網站提示詞",summary:"分析網站或應用程式截圖，整理元件位置、色彩和版面，產生可交給 AI 的建站提示詞。",category:"網頁與視覺設計",scenarios:["把網站截圖轉為可複製的建站提示詞","根據介面截圖整理元件、間距及響應式建議"],examplePrompt:"請使用 screenshot-to-website-prompt，分析我提供的截圖，產生完整建站提示詞，說明版面、元件、色彩和手機適配。",caution:"此 Skill 僅有本機版本，本站不提供下載或安裝；靜態截圖未顯示的互動需標明為推測。",tags:["網站截圖","介面分析","提示詞"],featured:false
  }
];
