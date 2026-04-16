import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <span>© 2026 Sollicitatie Coach</span>
        <div className="flex gap-5">
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          <Link href="/pricing" className="hover:text-gray-600">Prijzen</Link>
          <Link href="/privacy.html" className="hover:text-gray-600">Privacy</Link>
          <Link href="/terms.html" className="hover:text-gray-600">Voorwaarden</Link>
        </div>
      </div>
    </footer>
  );
}
