import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Sollicitatie Tips & CV Advies | Sollicitatie Coach',
  description: 'Praktische tips voor je CV, motivatiebrief en sollicitatiegesprek. Gratis advies van Sollicitatie Coach.',
};

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Blog</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Sollicitatie Tips & Advies</h1>
        <p className="text-gray-500 text-sm">Praktische tips voor een beter CV, sterkere motivatiebrief en succesvol sollicitatiegesprek.</p>
      </div>

      <div className="space-y-6">
        {blogPosts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card p-6 block hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              <span>{new Date(post.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readTime} lezen</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{post.description}</p>
            <p className="text-xs text-primary font-semibold mt-4">Lees meer →</p>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 card p-8 text-center bg-gray-900 border-0">
        <h2 className="text-xl font-extrabold text-white mb-2">Klaar om je CV te analyseren?</h2>
        <p className="text-gray-400 text-sm mb-5">Gebruik de tips uit de blog direct in de praktijk met onze AI-tool.</p>
        <Link href="/analyse" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors">
          Start gratis analyse →
        </Link>
      </div>
    </div>
  );
}
