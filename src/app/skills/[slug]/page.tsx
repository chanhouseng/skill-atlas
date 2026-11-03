import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { getSkillBySlug, githubUrl, installCommand, skills, skillsShUrl } from "@/data/skills";

type Props = { params: Promise<{slug: string}> };
export function generateStaticParams() { return skills.map((skill) => ({slug: skill.slug})); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug} = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {title:"找不到 Skill"};
  return {title:`${skill.zhName} · ${skill.slug}`, description: skill.summary};
}

export default async function SkillDetail({ params }: Props) {
  const {slug} = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();
  const related = skills.filter((other) => other.category === skill.category && other.slug !== skill.slug).slice(0,3);
  return <main id="main" className="container detail-page">
    <nav aria-label="麵包屑" className="breadcrumbs"><Link href="/">技能目錄</Link><span>/</span><span>{skill.category}</span><span>/</span><span>{skill.slug}</span></nav>
    <section className="detail-head">
      <div className="detail-heading-left">
        <div className="detail-overline"><span className="detail-category">{skill.category}</span><span className="detail-origin">原始來源可查證</span></div>
        <h1>{skill.zhName}</h1>
        <p className="detail-slug">{skill.slug}</p>
        <p className="detail-subtitle">{skill.summary}</p>
        <div className="detail-tag-list">{skill.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
      <div className="detail-mark" aria-hidden="true"><span>{skill.slug.slice(0,1).toUpperCase()}</span><small>SKILL<br/>FILE</small></div>
    </section>

    <div className="detail-layout">
      <div className="detail-content">
        <section className="detail-section">
          <div className="detail-section-number">01 / WHEN TO USE</div>
          <h2>甚麼時候適合使用？</h2>
          <p className="section-intro">遇到以下情況時，可以考慮先閱讀這個 Skill 的原始指引，再交由 AI 使用。</p>
          <ul className="scenario-list">{skill.scenarios.map((scenario) => <li key={scenario}><span className="scenario-check">✓</span>{scenario}</li>)}</ul>
        </section>
        <section className="detail-section" id="install">
          <div className="detail-section-number">02 / INSTALL</div>
          <h2>安裝這個 Skill</h2>
          <p className="section-intro">在自己的終端機執行以下指令。需要預先安裝 Node.js，使用前請先檢查原始倉庫內容。</p>
          <div className="code-panel"><div className="code-panel-top"><span>終端機指令</span><CopyButton value={installCommand(skill)} label="複製指令"/></div><pre><code>$ {installCommand(skill)}</code></pre></div>
          <p className="info-paragraph">CLI 會依照你的 AI 工具與安裝選項進行操作。本站只顯示命令，不會在你的電腦執行任何安裝。</p>
        </section>
        <section className="detail-section" id="prompt">
          <div className="detail-section-number">03 / HOW TO USE</div>
          <h2>建議怎樣調用？</h2>
          <p className="section-intro">下面是本站編寫的中文示例，已將任務、範圍和交付要求寫清楚。可直接複製，再改成你的實際需要。</p>
          <div className="prompt-panel"><div className="prompt-panel-top"><span>中文調用範例 · 編輯建議</span><CopyButton value={skill.examplePrompt} label="複製示例"/></div><p>{skill.examplePrompt}</p></div>
          <div className="usage-tip"><strong>調用小技巧</strong><p>安裝後，AI 工具可能根據任務自動選用 Skill，但不保證每次都觸發。需要明確使用時，建議在要求中直接寫出 Skill 名稱，並說明預期輸出。</p></div>
        </section>
        <section className="detail-section">
          <div className="detail-section-number">04 / BEFORE YOU START</div>
          <h2>使用前要注意</h2>
          <div className="caution-block"><span>!</span><p>{skill.caution}</p></div>
          <p className="fine-print">本站未對本 Skill 進行獨立安全審計。內容是中文編輯摘要，不是原作者授權翻譯；請以作者文件為準。</p>
        </section>
      </div>
      <aside className="detail-sidebar">
        <div className="source-panel">
          <div className="sidebar-panel-label">SKILL PROFILE</div>
          <h3>來源與資訊</h3>
          <dl><div><dt>原始名稱</dt><dd>{skill.slug}</dd></div><div><dt>GitHub 倉庫</dt><dd>{skill.source}</dd></div><div><dt>分類</dt><dd>{skill.category}</dd></div><div><dt>中文內容</dt><dd>本站編輯摘要</dd></div><div><dt>本站安全審核</dt><dd>尚未進行</dd></div></dl>
          <a href={skillsShUrl(skill)} className="source-link primary-source" target="_blank" rel="noopener noreferrer">在 skills.sh 查看 ↗</a>
          <a href={githubUrl(skill)} className="source-link" target="_blank" rel="noopener noreferrer">開啟 GitHub 倉庫 ↗</a>
        </div>
        <div className="sidebar-reminder"><span>給第一次使用 Skill 的你</span><p>Skill 是讓 AI 知道如何做某類任務的一份指引，並不等於立即取得外部帳號權限。</p><Link href="/about">閱讀使用指南 →</Link></div>
      </aside>
    </div>
    {related.length > 0 && <section className="related-section"><div className="related-header"><div><span className="section-label">DISCOVER MORE</span><h2>也可以看看這些 Skill</h2></div><Link href="/">返回全部技能 →</Link></div><div className="related-grid">{related.map((other)=><Link key={other.slug} className="related-card" href={`/skills/${other.slug}`}><span className="skill-code-name">{other.slug}</span><h3>{other.zhName}</h3><p>{other.summary}</p><span className="related-link">查看指南 ↗</span></Link>)}</div></section>}
  </main>;
}
