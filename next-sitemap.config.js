module.exports = {
  siteUrl: process.env.SITE_URL || "https://feedbackito.com",
  generateRobotsTxt: true,
  exclude: [
    '/api/*',
    '/dashboard/*',
    '/survey/*',
    '/widget/*',
    '/widjet/*',
    '/signin',
    '/thankyou',
    '/roadmap',
    '*.png',
    '*.jpg',
    '*.jpeg',
    '*.ico',
    '/apple-icon.png',
    '/icon.png',
    '/twitter-image.png',
    '/opengraph-image.png',
    '/favicon.ico'
  ],
  additionalPaths: async (config) => {
    return [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/privacy-policy', changefreq: 'monthly', priority: 0.8 },
      { loc: '/tos', changefreq: 'monthly', priority: 0.8 },
    ];
  },
};
