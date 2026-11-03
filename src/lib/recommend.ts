import type { Skill } from "../data/catalog.ts";

export type SkillRecommendation = { skill: Skill; reason: string; score: number };

type Intent = { pattern: RegExp; targets: string[]; reason: string };
/** Local, explainable intent matching. Not an LLM or an exhaustive semantic search. */
const intents: Intent[] = [
  {pattern:/網站|网站|網頁|网页|首頁|首页|landing\s*page|前端|網路頁面|web\s*page|网页布局|頁面佈局/i,
    targets:["frontend-design","landing-page-design","web-design-guidelines","web-artifacts-builder"],
    reason:"需求涉及網站頁面或前端，這個 Skill 可用於相關設計或實作"},
  {pattern:/美觀|美化|排版|布局|佈局|ui|ux|介面|界面|視覺設計|视觉设计/i,
    targets:["frontend-design","landing-page-design","web-design-guidelines","figma-designer"],
    reason:"你希望改善介面的版面、視覺或使用體驗"},
  {pattern:/截圖|截图|figma|設計稿|设计稿|組件|组件|design\s*system/i,
    targets:["figma-designer","figma-implement-design","figma-generate-design","web-design-guidelines"],
    reason:"需求與設計稿、組件或可編輯設計系統有關"},
  {pattern:/3d|three\.js|webgl|三維|三维|立體|立体|3D/i,
    targets:["frontend-design","landing-page-design","web-artifacts-builder"],
    reason:"你提到 3D 效果；這些 Skill 可協助網頁部分，但場景可能仍需 Three.js、模型及素材"},
  {pattern:/網頁測試|网页测试|測試網頁|测试网页|瀏覽器|浏览器|playwright|自動化測試|自动化测试|表單測試|表单测试/i,
    targets:["webapp-testing","playwright","playwright-interactive","test-driven-development"],
    reason:"你需要驗證網頁流程或用瀏覽器進行自動測試"},
  {pattern:/單元測試|单元测试|tdd|測試驅動|测试驱动|回歸測試|回归测试/i,
    targets:["tdd","test-driven-development","webapp-testing","code-review"],
    reason:"你的需求涉及程式測試和回歸驗證"},
  {pattern:/視頻|视频|影片|字幕|剪輯|剪辑|remotion|mp4|動畫短片|动画短片/i,
    targets:["remotion-best-practices","remotion-create","remotion-render","remotion-captions","remotion-multimedia"],
    reason:"你的目標是影片或字幕製作，對應程式化影片相關 Skill"},
  {pattern:/pdf|word|docx|excel|xlsx|ppt|pptx|簡報|简报|表格|文檔|文档|文件/i,
    targets:["pdf","docx","xlsx","pptx","doc-coauthoring"],
    reason:"你的任務是製作、整理或處理文件"},
  {pattern:/agent|智能體|智能体|mcp|工具調用|工具调用|function\s*call/i,
    targets:["mcp-builder","chatgpt-apps","claude-api","skill-creator"],
    reason:"需求與 AI Agent、工具連接或 MCP 整合有關"},
  {pattern:/bug|除錯|调试|debug|錯誤|错误|崩潰|崩溃|修復|修复/i,
    targets:["diagnosing-bugs","systematic-debugging","code-review","tdd"],
    reason:"你希望排查和修復程式錯誤"},
  {pattern:/部署|deploy|上線|上线|cloudflare|vercel|netlify|hosting/i,
    targets:["cloudflare-deploy","vercel-deploy","deploy-to-vercel","netlify-deploy"],
    reason:"你要把網站或服務部署到雲端"},
  {pattern:/git(hub)?|skill.*找|尋找.*skill|搜索.*skill|建立.*skill|创建.*skill/i,
    targets:["find-skills","skill-creator","gh-fix-ci","gh-address-comments"],
    reason:"需求與 Skill 搜尋或 GitHub 開發流程相關"}
];

function normalize(text: string): string { return text.normalize("NFKC").trim().toLowerCase(); }
const stopWords=/^(?:我|想|要|用|把|的|和|一個|一个|幫|帮|請|请|這個|这个|可以|能否|需要|做|如何|怎么|怎樣|怎样|應該|应该|進行|进行|讓|让|更加|能|會|会|很|更|都|來|来|地|將|将)$/;

/** Matches user intent to verified skills only and returns human-readable reasons. */
export function recommendSkills(items: Skill[], query: string, limit = 5): SkillRecommendation[] {
  const q=normalize(query);
  if (!q || q.length < 2) return [];
  const active=intents.filter(rule => rule.pattern.test(q));
  const scores=new Map<string,SkillRecommendation>();
  for(const rule of active) {
    rule.targets.forEach((slug,i)=>{
      for(const skill of items) {
        if(skill.slug!==slug) continue;
        const current=scores.get(skill.id);
        const increment=Math.max(3,12-i*2);
        if(!current) scores.set(skill.id,{skill,reason:rule.reason,score:increment});
        else scores.set(skill.id,{...current,score:current.score+increment});
      }
    });
  }
  // Exact English skill names and meaningful short technical words offer a fallback.
  const normalizedTokens=q.split(/[\s,，。:：;；！!、（）()]+/).filter(token=>token.length>=2&&!stopWords.test(token));
  for(const skill of items) {
    const slug=skill.slug.toLowerCase();
    const name=skill.name.toLowerCase();
    const exact=q.includes(slug) || q.includes(name);
    const techTokens=normalizedTokens.filter(token=>/[a-z0-9]/i.test(token)&& (slug.includes(token)||name.includes(token)));
    if(!exact&&!techTokens.length)continue;
    const old=scores.get(skill.id);
    const extra=exact?20:techTokens.length*5;
    scores.set(skill.id,{skill,score:(old?.score||0)+extra,reason:old?.reason || "你提到這個 Skill 的名稱或相關技術"});
  }
  return [...scores.values()].filter(v=>v.score>=5).sort((a,b)=>b.score-a.score || (a.skill.featured===b.skill.featured?0:a.skill.featured?-1:1) || a.skill.slug.localeCompare(b.skill.slug)).slice(0,Math.max(0,Math.min(10,limit)));
}
