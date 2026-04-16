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
  return { title: `${post.title} | Sollicitatie Coach Blog`, description: post.description };
}

function renderMd(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 class="post-h2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="post-h3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="post-li">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, m => `<ul class="post-ul">${m}</ul>`)
    .replace(/^(?!<[hul])(.+)$/gm, m => m.trim() ? `<p class="post-p">${m}</p>` : '')
    .replace(/\n{2,}/g, '\n');
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="blog-post-wrap">
      <Link href="/blog" style={{ fontSize: 13, color: 'var(--text-3)', display: 'block', marginBottom: 28 }}>← Terug naar blog</Link>

      <p className="blog-meta" style={{ marginBottom: 12 }}>
        {new Date(post.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTime} lezen
      </p>
      <h1 style={{ marginBottom: 12 }}>{post.title}</h1>
      <p style={{ fontSize: 16, marginBottom: 36 }}>{post.description}</p>

      <div dangerouslySetInnerHTML={{ __html: renderMd(post.content) }} />

      {/* CTA */}
      <div className="card" style={{ marginTop: 48, padding: 32, textAlign: 'center', background: 'var(--blue-faint)', border: '1px solid #BFD4FF' }}>
        <h3 style={{ marginBottom: 8 }}>Pas deze tips direct toe</h3>
        <p style={{ fontSize: 14, marginBottom: 20 }}>Analyseer je CV op een vacature en ontvang gepersonaliseerde feedback in 30 seconden.</p>
        <Link href="/analyse" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>Start gratis analyse →</Link>
      </div>

      {/* Other posts */}
      <div style={{ marginTop: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Andere artikelen</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {blogPosts.filter(p => p.slug !== post.slug).map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover" style={{ display: 'block', padding: '16px 20px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{p.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.readTime} lezen</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
