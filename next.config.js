const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
      "www.man-gos.com",
      "https://shipfast-template-supabse-k6pc.vercel.app"
    ],
  },
};

module.exports = nextConfig;
