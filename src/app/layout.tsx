import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./intent.css";

export const metadata: Metadata = {
  title: { default: "技集 · AI Skill 中文指南", template: "%s | 技集 Skill Atlas" },
  description: "發現值得了解的 AI Skills。以繁體中文閱讀用途、適用場景、安裝命令與實際調用範例。資訊有來源，使用有方法。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">跳至主要內容</a>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="brand" aria-label="技集 首頁">
              <span className="brand-logo" aria-hidden="true"><span className="brand-stem">✳</span></span>
              <span className="brand-name">技集<span className="brand-en">skill atlas</span></span>
            </Link>
            <nav className="main-nav" aria-label="主要導覽">
              <Link href="/" className="nav-link">探索技能</Link>
              <Link href="/about" className="nav-link">使用指南</Link>
              <a href="https://skills.sh/" target="_blank" rel="noopener noreferrer" className="nav-external">原始目錄 <span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <Link href="/" className="footer-brand">技集 <span>skill atlas</span></Link>
              <p>用中文找到合適的 AI Skill，也知道怎樣使用它。</p>
            </div>
            <div className="footer-links">
              <Link href="/">探索技能</Link>
              <Link href="/about">關於與使用說明</Link>
              <a href="https://skills.sh/docs" target="_blank" rel="noopener noreferrer">skills.sh 官方文件 ↗</a>
            </div>
          </div>
          <div className="container footer-bottom"><span>© 2026 技集 · 非 skills.sh 官方網站</span><span>資料為本站編輯整理，使用前請核對原作者指引。</span></div>
        </footer>
      </body>
    </html>
  );
}
