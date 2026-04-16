import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getPostBySlug } from '@/lib/blog';

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Sollicitatie Coach Blog`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: 'article' },
  };
}

// Minimal markdown renderer for headings, bold, lists
function renderContent(markdown: string): string {
  return markdown
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-extrabold text-gray-900 mt-8 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-900 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex gap-2 items-start"><span class="text-green-500 font-bold mt-0.5">✓</span><span>$1</span></li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex gap-2 items-start"><span class="text-gray-300 font-bold mt-0.5">□</span><span>$1</span></li>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-2 items-start"><span class="text-primary font-bold mt-0.5">•</span><span>$1</span></li>')
    .replace(/^(?!<[hlp]|<li)(.+)$/gm, (match) => match.trim() ? `<p class="text-gray-600 leading-relaxed text-sm mb-3">${match}</p>` : '')
    // Wrap consecutive <li> elements in <ul>
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul class="space-y-2 my-3 list-none">${match}</ul>`)
    .replace(/\n{2,}/g, '\n');
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/blog" className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-6 block">
        ← Terug naar blog
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>{new Date(post.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime} lezen</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-3">{post.title}</h1>
        <p className="text-gray-500 text-sm leading-relaxed">{post.description}</p>
      </div>

      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
      />

      {/* CTA box */}
      <div className="card p-7 text-center mt-10 bg-blue-50 border-blue-100">
        <h3 className="font-extrabold text-gray-900 mb-2">Pas deze tips direct toe</h3>
        <p className="text-sm text-gray-500 mb-4">Analyseer je CV op een vacature en ontvang gepersonaliseerde feedback in 30 seconden.</p>
        <Link href="/analyse" className="btn-primary btn-lg">
          Start gratis analyse →
        </Link>
      </div>

      {/* Other posts */}
      <div className="mt-10">
        <h2 className="font-bold text-sm text-gray-900 mb-4">Andere artikelen</h2>
        <div className="space-y-3">
          {blogPosts.filter(p => p.slug !== post.slug).map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block card p-4 hover:shadow-md transition-shadow group">
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{p.readTime} lezen</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
