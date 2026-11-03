"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MagnifyingGlass, ArrowUpRight, ArrowRight, X, Sparkle, SquaresFour, FunnelSimple } from "@phosphor-icons/react";
import type { Skill } from "@/data/skills";
import { categories } from "@/data/skills";
import { filterSkills } from "@/lib/search";
import { NaturalSkillFinder } from "@/components/natural-skill-finder";

export function Catalog({ items, verifiedAt }: { items: Skill[]; verifiedAt: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [featured, setFeatured] = useState(false);
  const [limit, setLimit] = useState(12);

  const filtered = useMemo(() => filterSkills(items, { query, category, featuredOnly: featured }), [items, query, category, featured]);
  const resetLimit = () => setLimit(12);
  const counts = useMemo(() => new Map(categories.map((cat) => [cat, items.filter((s) => s.category === cat).length])), [items]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow"><span className="eyebrow-dot" /> 中文 AI Skill 目錄與使用指南</span>
            <h1 className="hero-title">找到對的 Skill，<br /><span>讓 AI 真正幫得上忙。</span></h1>
            <p className="hero-description">不只知道有哪些工具，更知道甚麼時候用、怎樣安裝、如何正確調用。從一個需求開始，找到合適的 Skill。</p>
            <div className="hero-search">
              <MagnifyingGlass size={22} aria-hidden="true" weight="regular" />
              <input
                value={query}
                onChange={(event) => { setQuery(event.target.value); resetLimit(); }}
                placeholder="搜尋 Skill 名稱、用途或關鍵字..."
                aria-label="搜尋 Skill 名稱、用途或關鍵字"
                type="search"
              />
              {query ? (
                <button className="clear-search" type="button" onClick={() => {setQuery(""); resetLimit();}} aria-label="清除搜尋"><X size={18} /></button>
              ) : <span className="search-hint">中 / EN</span>}
            </div>
            <div className="hero-search-examples">熱門搜尋：
              {["前端設計", "React", "PDF", "測試"].map((item) => (
                <button key={item} type="button" onClick={() => {setQuery(item); setCategory("全部"); setFeatured(false); resetLimit(); document.getElementById("directory")?.scrollIntoView({behavior:"smooth"});}}>{item}</button>
              ))}
            </div>
          </div>
          <div className="hero-showcase" aria-label="從中文需求找到 Skill 的示例">
            <div className="showcase-top"><span><i className="showcase-led"/> SKILL MATCH</span><span>CHINESE → AI</span></div>
            <div className="showcase-question"><span>你的需求</span><p>「我想把網站設計得更專業」</p></div>
            <div className="showcase-connector"><span /><span /><span /></div>
            <div className="showcase-match">
              <span className="showcase-match-icon"><Sparkle size={22} weight="duotone" /></span>
              <div><strong>frontend-design</strong><small>前端視覺設計 · 建議選用</small></div>
              <span className="match-check">✓</span>
            </div>
            <div className="showcase-bottom"><span>用途、安裝、調用方法</span><span>一目了然 <ArrowUpRight size={15} /></span></div>
          </div>
        </div>
      </section>

      <section className="container quick-stats" aria-label="目錄說明">
        <div className="stat-item"><span className="stat-number">{items.length.toString().padStart(2, "0")}</span><span>個已核對來源 Skill</span></div>
        <div className="stat-item"><span className="stat-number">{categories.length.toString().padStart(2, "0")}</span><span>個主題分類</span></div>
        <div className="stat-item stat-long"><span className="stat-small-label">透明、可追溯</span><span>中文編輯摘要 · 原始來源連結 · 可複製調用範例</span></div>
      </section>

      <NaturalSkillFinder items={items}/>

      <section id="directory" className="container directory">
        <div className="section-heading">
          <div><span className="section-label">EXPLORE SKILLS</span><h2>探索技能庫<span className="title-punct">.</span></h2><p>挑選真正適合你目前任務的 Skill。</p></div>
          <div className="catalog-note"><span className="note-dot"/><span>來源更新：{verifiedAt.slice(0,10)} · 非即時排行榜</span></div>
        </div>

        <div className="directory-layout">
          <aside className="category-sidebar" aria-label="技能分類">
            <div className="sidebar-heading"><FunnelSimple size={17} weight="regular"/> 技能分類</div>
            <div className="category-list">
              <button type="button" onClick={() => {setCategory("全部"); resetLimit();}} aria-pressed={category === "全部"} className={category === "全部" ? "category-option active" : "category-option"}>
                <span className="category-name"><SquaresFour size={18} /> 全部技能</span><span className="category-count">{items.length}</span>
              </button>
              {categories.map((cat, i) => <button key={cat} type="button" onClick={() => {setCategory(cat); resetLimit();}} aria-pressed={category === cat} className={category === cat ? "category-option active" : "category-option"}>
                <span className="category-name"><span className="category-index">{(i+1).toString().padStart(2,"0")}</span>{cat}</span><span className="category-count">{counts.get(cat)}</span>
              </button>)}
            </div>
            <div className="sidebar-tip"><Sparkle size={20} weight="duotone"/><strong>初次使用 Skill？</strong><p>先閱讀安裝與使用說明，了解 Skill 能做甚麼、不能做甚麼。</p><Link href="/about">閱讀入門指南 <ArrowRight size={15}/></Link></div>
          </aside>

          <div className="catalog-main">
            <div className="catalog-toolbar">
              <div className="view-switch" role="group" aria-label="技能瀏覽模式">
                <button type="button" className={!featured ? "view-active" : ""} onClick={() => {setFeatured(false); resetLimit();}}>全部技能</button>
                <button type="button" className={featured ? "view-active" : ""} onClick={() => {setFeatured(true); resetLimit();}}>編輯精選</button>
              </div>
              <span className="results-count" aria-live="polite">找到 <strong>{filtered.length}</strong> 個 Skill</span>
            </div>

            <div className="mobile-categories" aria-label="手機版技能分類">
              <button type="button" aria-pressed={category === "全部"} className={category === "全部" ? "mobile-category active" : "mobile-category"} onClick={() => {setCategory("全部"); resetLimit();}}>全部</button>
              {categories.map((cat) => <button type="button" key={cat} aria-pressed={category === cat} className={category === cat ? "mobile-category active" : "mobile-category"} onClick={() => {setCategory(cat); resetLimit();}}>{cat}</button>)}
            </div>

            {filtered.length ? <div className="skill-grid">{filtered.slice(0, limit).map((skill) => <Link key={skill.id} href={`/skills/${skill.routeSlug}`} className="skill-card">
              <div className="skill-card-head"><span className="skill-mark">{skill.slug.slice(0,1).toUpperCase()}</span><ArrowUpRight size={19} className="card-arrow" weight="regular"/></div>
              <div className="skill-meta">{skill.category}</div>
              <h3>{skill.zhName}</h3><div className="skill-code-name">{skill.slug}</div><p>{skill.summary}</p>
              <div className="skill-tags">{skill.tags.slice(0,2).map(tag => <span key={tag}>{tag}</span>)}</div>
              <div className="skill-card-footer"><span>{skill.source}</span><span>查看指南 <ArrowRight size={14}/></span></div>
            </Link>)}</div> :
            <div className="empty-state"><div className="empty-symbol"><MagnifyingGlass size={27}/></div><h3>暫時找不到相關 Skill</h3><p>試試更簡短的關鍵字，或切換到全部分類。</p><button type="button" onClick={() => {setQuery(""); setCategory("全部"); setFeatured(false); resetLimit();}}>清除所有篩選條件</button></div>}
            {filtered.length > limit && <button className="load-more" type="button" onClick={() => setLimit(v=>v+12)}>顯示更多 Skill <ArrowRight size={16}/></button>}
          </div>
        </div>
      </section>

      <section className="container closing-section">
        <div><span className="section-label">A BETTER WAY TO START</span><h2>找到工具之後，<br/>下一步也要清楚。</h2></div>
        <div className="closing-copy"><p>每個 Skill 都有中文用途、實際場景與調用範例，讓你不用只憑英文名稱猜測是否適合。</p><Link href="/about">了解這個網站的使用方法 <ArrowUpRight size={18}/></Link></div>
      </section>
    </>
  );
}
