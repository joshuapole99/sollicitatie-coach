import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Sollicitatie Tips & CV Advies | Sollicitatie Coach',
  description: 'Praktische tips voor je CV, motivatiebrief en sollicitatiegesprek.',
};

export default function BlogPage() {
  return (
    <div className="blog-wrap">
      <p className="section-label">Blog</p>
      <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-.03em', color: '#0f172a', marginBottom: 10 }}>
        Sollicitatie Tips & Advies
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 0, lineHeight: 1.65 }}>
        Praktisch advies voor een beter CV, sterkere motivatiebrief en meer interviews.
      </p>

      <div className="blog-list">
        {blogPosts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
            <p className="blog-meta">
              {new Date(post.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTime} lezen
            </p>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <span className="blog-more">Lees meer →</span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-banner" style={{ marginTop: 56 }}>
        <h2>Pas de tips direct toe</h2>
        <p>Analyseer je CV op een vacature en ontvang gepersonaliseerde feedback in 30 seconden.</p>
        <Link href="/analyse" className="btn btn-white btn-lg" style={{ display: 'inline-flex' }}>
          Start gratis analyse →
        </Link>
      </div>
    </div>
  );
}
