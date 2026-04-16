import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">Sollicitatie Coach</span>
        <div className="footer-links">
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">Prijzen</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Voorwaarden</Link>
        </div>
        <span style={{ fontSize: 13, color: '#475569' }}>© 2026</span>
      </div>
    </footer>
  );
}
