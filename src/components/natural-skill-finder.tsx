"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useMemo, useState } from "react";
import { Sparkle, ArrowRight, Lightbulb } from "@phosphor-icons/react";
import type { Skill } from "@/data/skills";
import { recommendSkills } from "@/lib/recommend";

export function NaturalSkillFinder({ items }: {items:Skill[]}) {
  const {t}=useLanguage();
  const [description,setDescription]=useState("");
  const [submitted,setSubmitted]=useState("");
  const matches=useMemo(()=>recommendSkills(items,submitted,5),[items,submitted]);
  function search(){ setSubmitted(description.trim()); }
  return <section className="container intent-section" id="skill-finder" aria-labelledby="intent-title">
    <div className="intent-heading">
      <div><span className="section-label">DESCRIBE YOUR GOAL</span><h2 id="intent-title">{t("不知道 Skill 名稱？直接說你想做甚麼。")}</h2><p>{t("輸入完整需求，系統根據用途、情境與關鍵線索從已核對的 Skill 中找出候選，並解釋原因。")}</p></div>
      <span className="intent-method">{t("本機規則匹配 · 無 AI API 費用")}</span>
    </div>
    <div className="intent-editor">
      <label className="intent-label" htmlFor="intent-input">{t("描述你的目標")}</label>
      <textarea id="intent-input" rows={3} maxLength={600} placeholder={t("例如：我想做一個有 3D 互動效果的網站，也希望能在手機上流暢運行...")} value={description} onChange={e=>setDescription(e.target.value)}/>
      <div className="intent-actions">
        <div className="intent-hints">{t("試試：")}<button type="button" onClick={()=>setDescription("我想讓網站的介面更美觀、有設計感")}>{t("改善網頁設計")}</button><button type="button" onClick={()=>setDescription("我想用 Playwright 自動測試網站表單")}>{t("自動化測試")}</button></div>
        <button className="intent-submit" disabled={!description.trim()} type="button" onClick={search}><Sparkle size={17}/>{t(" 尋找合適 Skill ")}<ArrowRight size={16}/></button>
      </div>
    </div>
    {submitted && <div className="intent-results" aria-live="polite">
      {matches.length ? <>
        <div className="intent-results-head"><h3>{t("為你找到 ")}{matches.length}{t(" 個相關 Skill")}</h3><span>{t("相關性建議，不等於功能或安全保證")}</span></div>
        <div className="intent-result-grid">{matches.map(({skill,reason})=><Link key={skill.id} href={`/skills/${skill.routeSlug}`} className="intent-result">
          <div><strong>{t(skill.zhName)}</strong><span>{skill.name}</span></div>
          <p><Lightbulb size={17} aria-hidden="true"/>{t(reason)}</p>
          <small>{t("查看使用指南 ")}<ArrowRight size={13}/></small>
        </Link>)}</div>
      </> : <div className="intent-empty"><strong>{t("暫時找不到足夠符合的 Skill")}</strong><p>{t("可以更具體描述技術、目標或輸出形式，或改用下方的關鍵字目錄搜尋。")}</p></div>}
    </div>}
    <p className="intent-disclaimer">{t("推薦依編輯整理的中文用途與固定規則產生；不會上傳你的輸入，也不會連接或操作你的 Codex。")}</p>
  </section>;
}
