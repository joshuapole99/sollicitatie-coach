import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getPostBySlug } from '@/lib/blog';

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

// Next.js 15+ — params is a Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Sollicitatie Coach Blog`,
    description: post.description,
  };
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="blog-post-wrap">
      <Link href="/blog" style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 32 }}>
        ← Terug naar blog
      </Link>

      <p className="blog-meta">
        {new Date(post.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTime} lezen
      </p>
      <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-.03em', color: '#0f172a', margin: '12px 0 16px', lineHeight: 1.1 }}>
        {post.title}
      </h1>
      <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.65, marginBottom: 40 }}>{post.description}</p>

      <div dangerouslySetInnerHTML={{ __html: renderMd(post.content) }} />

      {/* CTA */}
      <div style={{ marginTop: 56, background: 'linear-gradient(135deg,#eff6ff,#eef2ff)', border: '1px solid #c7d2fe', borderRadius: 20, padding: '40px 32px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Pas deze tips direct toe</h3>
        <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24 }}>Analyseer je CV op een vacature en ontvang gepersonaliseerde feedback in 30 seconden.</p>
        <Link href="/analyse" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
          Start gratis analyse →
        </Link>
      </div>

      {/* Other posts */}
      <div style={{ marginTop: 48 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Andere artikelen</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {blogPosts.filter(p => p.slug !== post.slug).map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>{p.title}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{p.readTime} lezen</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
