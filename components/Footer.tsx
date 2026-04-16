import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>© 2026 Sollicitatie Coach</span>
        <div className="footer-links">
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">Prijzen</Link>
          <Link href="/privacy.html">Privacy</Link>
          <Link href="/terms.html">Voorwaarden</Link>
        </div>
      </div>
    </footer>
  );
}
