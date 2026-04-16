'use client';

import Link from 'next/link';
import { blogPosts } from '@/lib/blog';
import { useLanguage } from '@/components/LanguageProvider';
import { T } from '@/lib/i18n';

const colors = [
  { bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', accent: '#2563eb', icon: '📄' },
  { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', accent: '#16a34a', icon: '🎯' },
  { bg: 'linear-gradient(135deg,#fdf4ff,#f3e8ff)', accent: '#9333ea', icon: '⚡' },
];

export default function BlogPage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const locale = lang === 'nl' ? 'nl-NL' : 'en-GB';

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#312e81 100%)', padding: '64px 24px 56px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: '#818cf8', marginBottom: 14 }}>Blog</p>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 900, letterSpacing: '-.04em', color: '#fff', marginBottom: 14 }}>
          {t.blogTitle}
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 480, margin: '0 auto' }}>
          {t.blogSub}
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {blogPosts.map((post, i) => {
            const c = colors[i % colors.length];
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 28, transition: 'all .2s', boxShadow: '0 1px 4px rgba(0,0,0,.06)', cursor: 'pointer', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                      {new Date(post.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTime} {t.blogRead}
                    </p>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 8, letterSpacing: '-.02em', lineHeight: 1.3 }}>
                      {post.title}
                    </h2>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, marginBottom: 12 }}>{post.description}</p>
                    <span style={{ fontSize: 13, color: c.accent, fontWeight: 700 }}>{t.blogReadMore}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="cta-banner" style={{ marginTop: 56 }}>
          <h2>{t.blogCtaTitle}</h2>
          <p>{t.blogCtaSub}</p>
          <Link href="/analyse" className="btn btn-white btn-lg" style={{ display: 'inline-flex' }}>
            {t.blogCtaBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
