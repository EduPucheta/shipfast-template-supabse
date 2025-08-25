const config = { 
  // REQUIRED
  appName: "Feedbackito",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Survey analysis, AI boosted",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "feedbackito.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
    id: "04fa9fd0-49d0-4e4a-a417-f5091610da6f",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/none-pageaw,jfhakjsfas"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_456",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Free",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Free plan",
        // The price you want to display, the one user will be charged on Stripe.
        price: 0,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        
        features: [
          {
            name: "pricing.plans.free.features.0",
          },
          { name: "pricing.plans.free.features.1" },
          { name: "pricing.plans.free.features.2" },
          { name: "pricing.plans.free.features.3" },
          
        ],
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: false,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1R2HPPIPjutGjJ5SoNiP5bgq"
            : "price_1RnQuaIPjutGjJ5SWhDIor7k",  
        name: "Pro",
        description: "Pro plan",
        price: 29,
        priceAnchor: 49,
        features: [
          { name: "pricing.plans.pro.features.0" },
          {
            name: "pricing.plans.pro.features.1",
          },
         
        
          { name: "pricing.plans.pro.features.2" },
          { name: "pricing.plans.pro.features.3" },
          { name: "pricing.plans.pro.features.4" },
   

        ],
      },
      {
        isFeatured: false,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Ro8cPIPjutGjJ5SVbVEaOzD" // New single Price ID for tiered pricing
            : "price_1Ro8mvIPjutGjJ5S1Sk27DdQ",
        name: "Scale",
        description: "Scale plan",
        isSlider: true,
        // Tiers pricing logic for the frontend to calculate prices dynamically
        // This logic must match the tiered pricing configuration in Stripe
        pricing: (quantity) => {
          if (quantity === 1) {
            return 29;
          }
          if (quantity >= 2 && quantity <= 9) {
            return quantity * 24;
          }
          if (quantity >= 10 && quantity <= 19) {
            return quantity * 21;
          }
          if (quantity >= 20 && quantity <= 50) {
            return quantity * 17;
          }
          return 0;
        },
        // The min/max values for the slider
        slider: {
          min: 2,
          max: 50,
          step: 1,
        },
        features: [
          { name: "pricing.plans.scale.features.0" },
        ],
      },
    ],
    plans_annual: [
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: false,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_advanced_yearly_dev"
            : "price_1Rnmz2IPjutGjJ5SX65BYoE0",
        name: "Pro",
        description: "Pro plan",
        price: 29 * 10,
        priceAnchor: 49 * 12,
        features: [
          { name: "pricing.plans.pro.features.0" },
          {
            name: "pricing.plans.pro.features.1",
          },
          { name: "pricing.plans.pro.features.2" },
          { name: "pricing.plans.pro.features.3" },
          { name: "pricing.plans.pro.features.4" },
          { name: "pricing.plans.pro.features.5" },
        ],
      },
      {
        isFeatured: false,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_dev_scale_tiered_yearly" // New single Price ID for tiered pricing
            : "price_1Ro8wEIPjutGjJ5S9LcbP4Ni",
        name: "Scale",
        description: "Scale plan",
        isSlider: true,
        pricing: (quantity) => {
          // Annual pricing logic based on monthly rates with a 10x multiplier ("2 months free")
          if (quantity === 1) {
            return 29 * 10;
          }
          if (quantity >= 2 && quantity <= 9) {
            return quantity * 24 * 10;
          }
          if (quantity >= 10 && quantity <= 19) {
            return quantity * 21 * 10;
          }
          if (quantity >= 20 && quantity <= 50) {
            return quantity * 17 * 10;
          }
          return 0;
        },
        slider: {
          min: 1,
          max: 50,
          step: 1,
        },
        features: [
          { name: "pricing.plans.scale.features.0" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
    subdomain: "mg",
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `ShipFast <noreply@mg.shipfa.st>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Marc at ShipFast <marc@mg.shipfa.st>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "edugpucheta@gmail.com",
    // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
    forwardRepliesTo: "edugpucheta@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    // theme: "cyberpunk", 
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
   // main: themes[`[data-theme=cupcake]`]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
};

export default config;
