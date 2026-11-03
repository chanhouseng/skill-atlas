import Link from "next/link";

export const metadata = { title: "使用指南與資料來源" };

export default function AboutPage() {
  return <main id="main" className="container about-page">
    <div className="breadcrumbs"><Link href="/">首頁</Link><span>/</span><span>使用指南</span></div>
    <div className="about-hero"><span className="section-label">ABOUT SKILL ATLAS</span><h1>找到 Skill，只是第一步。</h1><p>更重要的是理解它能幫你做甚麼，如何安裝、何時調用，以及需要注意哪些限制。</p></div>
    <div className="about-layout">
      <section className="about-section"><h2>如何使用技集</h2>
        <div className="guide-step"><span>01</span><div><h3>先說出你的需求</h3><p>在首頁輸入「網頁」「React」「PDF」等詞，或按類別查看。第一批提供關鍵字搜尋，並非語意 AI 搜尋。</p></div></div>
        <div className="guide-step"><span>02</span><div><h3>閱讀中文解說與來源</h3><p>詳細頁列出適用場景、注意事項與原始 Skill 來源。中文內容由本站編輯整理，請以作者的原始指引為準。</p></div></div>
        <div className="guide-step"><span>03</span><div><h3>自行安裝與調用</h3><p>複製安裝指令到自己的終端機，依照工具官方說明完成安裝。也可以複製本站的調用示例，在 Codex、Claude Code 或 Cursor 中使用。</p></div></div>
      </section>
      <aside className="about-note"><h3>本站不會做的事</h3><p>不登入你的 AI 開發工具、不在你的電腦上安裝任何 Skill，也不替你遠端執行指令。所有命令都是提供給你自行判斷後使用。</p><div className="note-divider"></div><h3>安全與來源</h3><p>即使收錄在 skills.sh，仍不能保證 Skill 安全。安裝前請檢查原始 SKILL.md、程式碼與所需權限。本站未做獨立安全審核。</p></aside>
    </div>
    <div className="about-cta"><div><h2>從一個實際任務開始</h2><p>試試搜尋「前端」「PDF」或「測試」。</p></div><Link href="/" className="primary-button">前往技能目錄 ↗</Link></div>
  </main>;
}
