import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getPostBySlug } from '@/lib/blog';

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

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
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0f172a;font-weight:700">$1</strong>')
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
    <div>
      {/* Hero header */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#312e81 100%)', padding: '56px 24px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link href="/blog" style={{ fontSize: 13, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Terug naar blog
          </Link>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
            {new Date(post.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTime} lezen
          </p>
          <h1 style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: 16 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.65 }}>{post.description}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
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
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: 'block', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 20px', transition: 'all .18s', textDecoration: 'none' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>{p.title}</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>{p.readTime} lezen</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
