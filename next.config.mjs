/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'api.placehold.co',
      'images.unsplash.com',
      'hxkwblurwgzozqspgnsf.supabase.co',
    ],
  },
};

export default nextConfig;
