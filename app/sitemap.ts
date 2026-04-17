import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sollicitatie-coach.vercel.app';

  const now = new Date();

  const staticPages = [
    { url: base,                    priority: 1.0, changeFrequency: 'weekly'  as const, lastModified: now },
    { url: `${base}/analyse`,       priority: 0.9, changeFrequency: 'monthly' as const, lastModified: now },
    { url: `${base}/pricing`,       priority: 0.8, changeFrequency: 'monthly' as const, lastModified: now },
    { url: `${base}/blog`,          priority: 0.8, changeFrequency: 'weekly'  as const, lastModified: now },
    { url: `${base}/login`,         priority: 0.5, changeFrequency: 'yearly'  as const, lastModified: now },
    { url: `${base}/signup`,        priority: 0.6, changeFrequency: 'yearly'  as const, lastModified: now },
    { url: `${base}/privacy`,       priority: 0.3, changeFrequency: 'yearly'  as const, lastModified: now },
    { url: `${base}/terms`,         priority: 0.3, changeFrequency: 'yearly'  as const, lastModified: now },
  ];

  const blogPages = blogPosts.map(post => ({
    url: `${base}/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(post.date),
  }));

  return [...staticPages, ...blogPages];
}
