import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sollicitatie-coach.vercel.app';

  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${base}/analyse`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${base}/pricing`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/blog`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/login`, priority: 0.5, changeFrequency: 'yearly' as const },
    { url: `${base}/signup`, priority: 0.6, changeFrequency: 'yearly' as const },
  ];

  const blogPages = blogPosts.map(post => ({
    url: `${base}/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(post.date),
  }));

  return [...staticPages, ...blogPages];
}
