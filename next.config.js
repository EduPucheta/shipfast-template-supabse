const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
  
      "https://shipfast-template-supabse-k6pc.vercel.app"
    ],
  },
  // Suppress hydration warnings in development
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  // Enable experimental features to help with widget loading
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
