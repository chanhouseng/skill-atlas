import Link from "next/link";
export default function NotFound() {
  return <main id="main" className="container not-found"><div className="not-found-mark">404</div><h1>這個 Skill 尚未收錄</h1><p>請確認網址，或回到目錄搜尋其他 Skill。</p><Link className="primary-button" href="/">返回技能目錄 ↗</Link></main>;
}
