import Link from "next/link";
import { skills, lastSyncAt } from "@/data/skills";
export const metadata = { title: "使用指南與資料來源" };

export default function AboutPage() {
  const repoCount = new Set(skills.map(s=>s.source)).size;
  return <main id="main" className="container about-page">
    <div className="breadcrumbs"><Link href="/">首頁</Link><span>/</span><span>使用指南</span></div>
    <div className="about-hero"><span className="section-label">ABOUT SKILL ATLAS</span><h1>找到 Skill，只是第一步。</h1><p>更重要的是理解它能幫你做甚麼，如何安裝、何時調用，以及需要注意哪些限制。</p></div>
    <div className="about-layout">
      <section className="about-section"><h2>如何使用技集</h2>
        <div className="guide-step"><span>01</span><div><h3>先說出你的需求</h3><p>在首頁輸入「網頁」「React」「PDF」等詞，或按類別查看。目前提供關鍵字搜尋，並非 AI 語意搜尋。</p></div></div>
        <div className="guide-step"><span>02</span><div><h3>閱讀中文解說與來源</h3><p>詳細頁列出適用場景、注意事項與原始 GitHub SKILL.md 連結。中文內容是本站根據公開來源編輯的摘要，不是官方翻譯。</p></div></div>
        <div className="guide-step"><span>03</span><div><h3>自行安裝與調用</h3><p>複製安裝指令到自己的終端機，依照工具官方說明完成安裝。本站也提供可修改的中文調用示例，不會替你操作任何 AI 工具。</p></div></div>
        <div className="guide-step"><span>04</span><div><h3>查看來源更新情況</h3><p>本站定期由維護者手動核對 GitHub 原始檔案的 SHA。若作者更新後中文說明尚未重新審閱，詳細頁會顯示提醒。</p></div></div>
      </section>
      <aside className="about-note">
        <h3>目前收錄情況</h3>
        <p>共 {skills.length} 個有原始檔案證據的 Skill，來自 {repoCount} 個公開 GitHub 倉庫。最近完成來源核對：{lastSyncAt.slice(0,10)}。</p>
        <p>來源資料儲存在本站快照中，並非即時安裝量排行榜；不能根據收錄推斷 Skill 已完成獨立安全審計。</p>
        <div className="note-divider" />
        <h3>本站不會做的事</h3>
        <p>不登入你的 Codex、Claude Code、Cursor，也不替你安裝或執行任何 Skill。用戶自行核對命令、來源與依賴。</p>
        <div className="note-divider" />
        <h3>API 與同步方式</h3>
        <p>目前使用 GitHub 公開原始檔案核對與本地快照；skills.sh 官方 API 需要 Vercel OIDC 認證，目前尚未接入，因此不會顯示未核實的安裝數及安全分數。</p>
        <div className="note-divider" />
        <h3>安全與來源</h3>
        <p>來源存在不代表程式安全。執行任何第三方安裝指令前，請閱讀原始 SKILL.md 及所需權限。</p>
      </aside>
    </div>
    <div className="about-cta"><div><h2>從一個實際任務開始</h2><p>試試搜尋「前端」「PDF」或「測試」。</p></div><Link href="/" className="primary-button">前往技能目錄 ↗</Link></div>
  </main>;
}
