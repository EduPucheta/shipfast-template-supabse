module.exports = {
  siteUrl: process.env.SITE_URL || "https://feedbackito.com",
  generateRobotsTxt: true,
  exclude: [
    // Metadata files
    "/twitter-image.*", 
    "/opengraph-image.*", 
    "/icon.*",
    // Private routes
    "/dashboard/*",
    "/signin/*",
    // API routes
    "/api/*",
    // Widget/embed routes
    "/widget/*",
    "/widjet/*",
    // Dynamic user-generated content
    "/survey/*",
    // Language-specific excluded routes
    "/*/dashboard/*",
    "/*/signin/*",
  ],
  // Handle multi-language routes
  additionalPaths: async (config) => {
    const result = [];
    const languages = ['en', 'es'];
    
    // Add language-specific public pages
    languages.forEach(lang => {
      result.push({
        loc: `/${lang}`,
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: `/${lang}/privacy-policy`,
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: `/${lang}/tos`,
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: `/${lang}/thankyou`,
        lastmod: new Date().toISOString(),
      });
    });
    
    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/widget/', '/widjet/'],
      },
    ],
  },
}
