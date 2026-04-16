/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from Supabase storage (update bucket URL when ready)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

module.exports = nextConfig;
