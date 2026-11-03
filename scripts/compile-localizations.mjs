import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const snapshot=JSON.parse(await readFile(path.join(root,"src/data/catalog.snapshot.json"),"utf8"));
const source=await readFile(path.join(root,"src/data/catalog.zh.tsv"),"utf8");
const categories=["網頁與視覺設計","程式開發","測試與品質","Agent 與自動化","文件與辦公","影音與創作","學習與協作","Skill 工具"];
const byId=new Map(snapshot.entries.map(item=>[item.id,item]));
let existing={};
try{existing=JSON.parse(await readFile(path.join(root,"src/data/catalog.zh.json"),"utf8"));}
catch(error){if(error.code!=="ENOENT")throw error;}
const edited={};
let repo="";
const featured=new Set(["landing-page-design","figma-designer","frontend-design","mcp-builder","skill-creator","webapp-testing","pdf","xlsx","pptx","react-best-practices","web-design-guidelines","playwright","cloudflare-deploy","figma-generate-design","code-review","tdd","find-skills","remotion-best-practices","systematic-debugging","security-threat-model","jupyter-notebook","chatgpt-apps"]);
function getCaution(row) {
  if(row.source==="openai/skills" && row.slug.startsWith("figma") || row.slug==="figma-designer" ) return "必須先具備可用且已授權的 Figma 工具連線；僅有 Skill 並不代表已能編輯設計檔。";
  if(["cloudflare-deploy","netlify-deploy","render-deploy","vercel-deploy","deploy-to-vercel","vercel-cli-with-tokens"].includes(row.slug))return "部署會涉及外部帳號、設定或費用，應先確認權限與方案；本站不會代為部署。";
  if(row.slug==="sentry"||row.slug==="linear"||row.slug.startsWith("notion-"))return "需要相應服務的有效連線與權限；請避免公開帳號資料或機密資訊。";
  if(row.category==="測試與品質")return "需要實際的程式碼、日誌或測試環境才能驗證；不能只依文字建議就判定問題已修復。";
  if(row.category==="影音與創作")return "部分功能需要媒體檔案、渲染依賴或 API；先確認輸出格式、素材授權及環境。";
  return "這是來自第三方倉庫的技能指引，安裝前請閱讀原始 SKILL.md 並評估依賴及權限。本站未做獨立安全審核。";
}
for(const line of source.replace(/^\uFEFF/,"").split(/\r?\n/)){
  const v=line.trim();
  if(!v||v.startsWith("//"))continue;
  if(v.startsWith("#")){repo=v.slice(1);continue;}
  const p=v.split("|");
  if(p.length!==6)throw new Error("Bad zh TSV line (expect 6 columns): "+v);
  const [slug,zhName,summary,index,scenariosText,instruction]=p;
  const id=repo+"/"+slug;const raw=byId.get(id);
  if(!raw)throw new Error("No verified source for "+id);
  if(edited[id])throw new Error("Duplicate Chinese record "+id);
  const category=categories[Number(index)];
  if(!category)throw new Error("Invalid category for "+id);
  const scenes=scenariosText.split("；").map(x=>x.trim()).filter(Boolean);
  const row={source:repo,slug,category};
  edited[id]={
    zhName,
    summary,
    category,
    scenarios:scenes,
    examplePrompt:`請使用 ${raw.name} Skill，${instruction}請先核對任務限制與所需工具，按照技能指引進行，最後簡短回報實際成果與驗證方式。`,
    caution:getCaution(row),
    tags:[...new Set([slug.split("-").slice(0,2).join(" "), ...scenes.slice(0,2)])],
    featured:featured.has(slug),
    // Never automatically mark an updated source SHA as reviewed.
    reviewedSha:existing[id]?.reviewedSha ?? raw.sha
  };
}
const missing=snapshot.entries.filter(x=>!edited[x.id]);
if(missing.length)throw new Error("Untranslated verified entries: "+missing.map(x=>x.id).join(", "));
await writeFile(path.join(root,"src/data/catalog.zh.json"),JSON.stringify(edited,null,2)+"\n","utf8");
console.log("LOCALIZED",Object.keys(edited).length,"verified records");
