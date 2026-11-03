import Link from "next/link";
import raw from "@/data/discovery.candidates.json";
import { LocaleText } from "@/components/language-provider";
export const metadata={title:"新發現 Skill｜待審核清單"};
export default function DiscoveriesPage(){
 const candidates=[...raw.candidates].sort((a,b)=>b.firstSeen.localeCompare(a.firstSeen)||a.slug.localeCompare(b.slug));
 return <main id="main" className="container discoveries-page">
   <div className="breadcrumbs"><Link href="/"><LocaleText text="技能目錄"/></Link><span>/</span><span><LocaleText text="新發現 · 待審核"/></span></div>
   <div className="discoveries-hero">
    <span className="section-label">GITHUB DISCOVERY</span>
    <h1><LocaleText text="GitHub 新發現 Skill"/></h1>
    <p><LocaleText text="持續尋找公開 GitHub 倉庫中的 SKILL.md。這裏只展示尚未通過本站內容與安全核對的候選，不代表已正式收錄或推薦安裝。"/></p>
   </div>
   <div className="discovery-summary">
    <div><strong>{candidates.length}</strong><span><LocaleText text="個待核對候選"/></span></div>
    <div><strong>{new Set(candidates.map(c=>c.source)).size}</strong><span><LocaleText text="個候選來源倉庫"/></span></div>
    <div><strong>{raw.scannedAt.slice(0,10)}</strong><span><LocaleText text="最近收集日期"/></span></div>
   </div>
   <div className="discoveries-warning"><strong><LocaleText text="重要提醒"/></strong><p><LocaleText text="GitHub 沒有完整的 Skill 總目錄，這份清單不是全量爬取，也不是安全審核結果。候選僅列出原始倉庫與 SKILL.md；安裝前需要人工確認授權、依賴、權限和指令內容。"/></p></div>
   {candidates.length?<div className="candidate-grid">{candidates.map(c=><article className="candidate-card" key={c.id}>
    <div className="candidate-card-head"><span className="candidate-status"><LocaleText text="待審核"/></span><span>{c.firstSeen.slice(0,10)}</span></div>
    <h2>{c.slug}</h2><p className="candidate-repo">{c.source}</p><p className="candidate-path">{c.path}</p>
    <div className="candidate-footer"><span><LocaleText text="尚未提供中文使用教學或安裝指令"/></span><a href={c.sourceFileUrl} target="_blank" rel="noopener noreferrer"><LocaleText text="核對原始 SKILL.md ↗"/></a></div>
   </article>)}</div>:<div className="intent-empty"><strong><LocaleText text="目前尚未取得可展示的新候選"/></strong><p><LocaleText text="請在維護環境執行每週 GitHub 掃描，確認 API 權限與限額後再更新。"/></p></div>}
   <div className="discoveries-footer-note"><Link href="/"><LocaleText text="返回已核對的 Skill 目錄 →"/></Link></div>
  </main>;
}
