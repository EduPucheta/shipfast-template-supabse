const config = { 
  // REQUIRED
  appName: "Feedbackr",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Survey analysis, AI boosted",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "feedbackr.com",
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
        name: "Starter",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for small projects",
        // The price you want to display, the one user will be charged on Stripe.
        price: 0,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        
        features: [
          {
            name: "200 monthly responses",
          },
          { name: "Unlimited surveys" },
          { name: "Fully customizable" },
          { name: "Some tokens to talk to the AI" },
          
        ],
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: false,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1R2HPPIPjutGjJ5SoNiP5bgq"
            : "price_456",
        name: "Pro",
        description: "You need more power",
        price: 49,
        priceAnchor: 79,
        features: [
          { name: "Everything in Starter plan" },
          {
            name: "Unlimited responses",
          },
         
        
          { name: "100 million monthly AI tokens" },
          { name: "Remove Feedbackr branding" },

        ],
      },
      {
        isFeatured: false,
        name: "Scale",
        description: "For managing multiple sites",
        isSlider: true,
        features: [
          { name: "Everything in Pro" },
          { name: "Unlimited team members" },
          
          
        ],
        // tiers for the slider. Add as many as you want.
        // IMPORTANT: The priceId for each tier must be created in your Stripe dashboard.
        // You'll have a price for monthly and yearly for each tier.
        tiers: [
          {
            websites: 5,
            price: 99,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_1P8S2APIPjutGjJ51c24nS23"
                : "price_prod_scale_monthly_5",
          },
          {
            websites: 10,
            price: 149,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_1P8S2PIPjutGjJ5p7N55ZLY"
                : "price_prod_scale_monthly_10",
          },
          {
            websites: 25,
            price: 249,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_1P8S2XPIPjutGjJ5k1a2wW1o"
                : "price_prod_scale_monthly_25",
          },
          {
            websites: 50,
            price: 399,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_1P8S2mPIPjutGjJ52v0zIuxu"
                : "price_prod_scale_monthly_50",
          },
        ],
      },
    ],
    plans_annual: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_starter_yearly_dev"
            : "price_starter_yearly_prod",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Starter",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for small projects",
        // The price you want to display, the one user will be charged on Stripe.
        price: 0,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        
        features: [
          {
            name: "200 monthly responses",
          },
          { name: "Unlimited surveys" },
          { name: "Fully customizable" },
          { name: "Some tokens to talk to the AI" },
        ],
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: false,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_advanced_yearly_dev"
            : "price_advanced_yearly_prod",
        name: "Pro",
        description: "You need more power",
        price: 49 * 10,
        priceAnchor: 49 * 12,
        features: [
          { name: "Everything in Starter" },
          {
            name: "Unlimited responses",
          },
          { name: "100 million monthly AI tokens" },
          { name: "Remove Feedbackr branding" },
        ],
      },
      {
        isFeatured: false,
        name: "Scale",
        description: "For managing multiple sites",
        isSlider: true,
        features: [
          { name: "Unlimited team members" },
          
          
        ],
        // tiers for the slider. Add as many as you want.
        // IMPORTANT: The priceId for each tier must be created in your Stripe dashboard.
        // You'll have a price for monthly and yearly for each tier.
        tiers: [
          {
            websites: 5,
            price: 99 * 10,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_1P8S3APIPjutGjJ5sZ9b3n8a"
                : "price_prod_scale_yearly_5",
          },
          {
            websites: 10,
            price: 149 * 10,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_1P8S3IPIPjutGjJ571z2M3S3"
                : "price_prod_scale_yearly_10",
          },
          {
            websites: 25,
            price: 249 * 10,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_1P8S3QPIPjutGjJ5eY3f4n1E"
                : "price_prod_scale_yearly_25",
          },
          {
            websites: 50,
            price: 399 * 10,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_1P8S3XPIPjutGjJ57a0b3A9S"
                : "price_prod_scale_yearly_50",
          },
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
    supportEmail: "marc@mg.shipfa.st",
    // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
    forwardRepliesTo: "marc.louvion@gmail.com",
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
