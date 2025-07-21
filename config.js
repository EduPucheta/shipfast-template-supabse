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
        name: "pricing.plans.free.name",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "pricing.plans.free.description",
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
            : "price_456",
        name: "pricing.plans.pro.name",
        description: "pricing.plans.pro.description",
        price: 49,
        priceAnchor: 79,
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
        name: "pricing.plans.scale.name",
        description: "pricing.plans.scale.description",
        isSlider: true,
        features: [
          { name: "pricing.plans.scale.features.0" },
        
          
          
        ],
        // tiers for the slider. Add as many as you want.
        // IMPORTANT: The priceId for each tier must be created in your Stripe dashboard.
        // You'll have a price for monthly and yearly for each tier.
        tiers: [
          {
            websites: 2,
            price: 69,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_2"
                : "price_prod_scale_monthly_2",
          },
          {
            websites: 3,
            price: 89,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_3"
                : "price_prod_scale_monthly_3",
          },
          {
            websites: 4,
            price: 109,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_4"
                : "price_prod_scale_monthly_4",
          },
          {
            websites: 5,
            price: 129,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_5"
                : "price_prod_scale_monthly_5",
          },
          {
            websites: 6,
            price: 144,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_6"
                : "price_prod_scale_monthly_6",
          },
          {
            websites: 7,
            price: 159,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_7"
                : "price_prod_scale_monthly_7",
          },
          {
            websites: 8,
            price: 174,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_8"
                : "price_prod_scale_monthly_8",
          },
          {
            websites: 9,
            price: 189,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_9"
                : "price_prod_scale_monthly_9",
          },
          {
            websites: 10,
            price: 204,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_10"
                : "price_prod_scale_monthly_10",
          },
          {
            websites: 11,
            price: 219,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_11"
                : "price_prod_scale_monthly_11",
          },
          {
            websites: 12,
            price: 234,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_12"
                : "price_prod_scale_monthly_12",
          },
          {
            websites: 13,
            price: 249,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_13"
                : "price_prod_scale_monthly_13",
          },
          {
            websites: 14,
            price: 264,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_14"
                : "price_prod_scale_monthly_14",
          },
          {
            websites: 15,
            price: 279,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_15"
                : "price_prod_scale_monthly_15",
          },
          {
            websites: 16,
            price: 294,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_16"
                : "price_prod_scale_monthly_16",
          },
          {
            websites: 17,
            price: 309,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_17"
                : "price_prod_scale_monthly_17",
          },
          {
            websites: 18,
            price: 324,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_18"
                : "price_prod_scale_monthly_18",
          },
          {
            websites: 19,
            price: 339,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_19"
                : "price_prod_scale_monthly_19",
          },
          {
            websites: 20,
            price: 354,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_20"
                : "price_prod_scale_monthly_20",
          },
          {
            websites: 21,
            price: 369,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_21"
                : "price_prod_scale_monthly_21",
          },
          {
            websites: 22,
            price: 384,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_22"
                : "price_prod_scale_monthly_22",
          },
          {
            websites: 23,
            price: 399,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_23"
                : "price_prod_scale_monthly_23",
          },
          {
            websites: 24,
            price: 414,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_24"
                : "price_prod_scale_monthly_24",
          },
          {
            websites: 25,
            price: 429,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_25"
                : "price_prod_scale_monthly_25",
          },
          {
            websites: 26,
            price: 444,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_26"
                : "price_prod_scale_monthly_26",
          },
          {
            websites: 27,
            price: 459,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_27"
                : "price_prod_scale_monthly_27",
          },
          {
            websites: 28,
            price: 474,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_28"
                : "price_prod_scale_monthly_28",
          },
          {
            websites: 29,
            price: 489,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_29"
                : "price_prod_scale_monthly_29",
          },
          {
            websites: 30,
            price: 504,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_30"
                : "price_prod_scale_monthly_30",
          },
          {
            websites: 31,
            price: 519,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_31"
                : "price_prod_scale_monthly_31",
          },
          {
            websites: 32,
            price: 534,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_32"
                : "price_prod_scale_monthly_32",
          },
          {
            websites: 33,
            price: 549,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_33"
                : "price_prod_scale_monthly_33",
          },
          {
            websites: 34,
            price: 564,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_34"
                : "price_prod_scale_monthly_34",
          },
          {
            websites: 35,
            price: 579,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_35"
                : "price_prod_scale_monthly_35",
          },
          {
            websites: 36,
            price: 594,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_36"
                : "price_prod_scale_monthly_36",
          },
          {
            websites: 37,
            price: 609,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_37"
                : "price_prod_scale_monthly_37",
          },
          {
            websites: 38,
            price: 624,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_38"
                : "price_prod_scale_monthly_38",
          },
          {
            websites: 39,
            price: 639,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_39"
                : "price_prod_scale_monthly_39",
          },
          {
            websites: 40,
            price: 654,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_40"
                : "price_prod_scale_monthly_40",
          },
          {
            websites: 41,
            price: 669,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_41"
                : "price_prod_scale_monthly_41",
          },
          {
            websites: 42,
            price: 684,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_42"
                : "price_prod_scale_monthly_42",
          },
          {
            websites: 43,
            price: 699,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_43"
                : "price_prod_scale_monthly_43",
          },
          {
            websites: 44,
            price: 714,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_44"
                : "price_prod_scale_monthly_44",
          },
          {
            websites: 45,
            price: 729,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_45"
                : "price_prod_scale_monthly_45",
          },
          {
            websites: 46,
            price: 744,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_46"
                : "price_prod_scale_monthly_46",
          },
          {
            websites: 47,
            price: 759,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_47"
                : "price_prod_scale_monthly_47",
          },
          {
            websites: 48,
            price: 774,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_48"
                : "price_prod_scale_monthly_48",
          },
          {
            websites: 49,
            price: 789,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_49"
                : "price_prod_scale_monthly_49",
          },
          {
            websites: 50,
            price: 804,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_monthly_50"
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
        name: "pricing.plans.free.name",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "pricing.plans.free.description",
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
            ? "price_advanced_yearly_dev"
            : "price_advanced_yearly_prod",
        name: "pricing.plans.pro.name",
        description: "pricing.plans.pro.description",
        price: 49 * 10,
        priceAnchor: 49 * 12,
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
        name: "pricing.plans.scale.name",
        description: "pricing.plans.scale.description",
        isSlider: true,
        features: [
          { name: "pricing.plans.scale.features.0" },
         
          
          
        ],
        // tiers for the slider. Add as many as you want.
        // IMPORTANT: The priceId for each tier must be created in your Stripe dashboard.
        // You'll have a price for monthly and yearly for each tier.
        tiers: [
          {
            websites: 2,
            price: 690,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_2"
                : "price_prod_scale_yearly_2",
          },
          {
            websites: 3,
            price: 890,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_3"
                : "price_prod_scale_yearly_3",
          },
          {
            websites: 4,
            price: 1090,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_4"
                : "price_prod_scale_yearly_4",
          },
          {
            websites: 5,
            price: 1290,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_5"
                : "price_prod_scale_yearly_5",
          },
          {
            websites: 6,
            price: 1440,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_6"
                : "price_prod_scale_yearly_6",
          },
          {
            websites: 7,
            price: 1590,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_7"
                : "price_prod_scale_yearly_7",
          },
          {
            websites: 8,
            price: 1740,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_8"
                : "price_prod_scale_yearly_8",
          },
          {
            websites: 9,
            price: 1890,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_9"
                : "price_prod_scale_yearly_9",
          },
          {
            websites: 10,
            price: 2040,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_10"
                : "price_prod_scale_yearly_10",
          },
          {
            websites: 11,
            price: 2190,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_11"
                : "price_prod_scale_yearly_11",
          },
          {
            websites: 12,
            price: 2340,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_12"
                : "price_prod_scale_yearly_12",
          },
          {
            websites: 13,
            price: 2490,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_13"
                : "price_prod_scale_yearly_13",
          },
          {
            websites: 14,
            price: 2640,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_14"
                : "price_prod_scale_yearly_14",
          },
          {
            websites: 15,
            price: 2790,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_15"
                : "price_prod_scale_yearly_15",
          },
          {
            websites: 16,
            price: 2940,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_16"
                : "price_prod_scale_yearly_16",
          },
          {
            websites: 17,
            price: 3090,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_17"
                : "price_prod_scale_yearly_17",
          },
          {
            websites: 18,
            price: 3240,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_18"
                : "price_prod_scale_yearly_18",
          },
          {
            websites: 19,
            price: 3390,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_19"
                : "price_prod_scale_yearly_19",
          },
          {
            websites: 20,
            price: 3540,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_20"
                : "price_prod_scale_yearly_20",
          },
          {
            websites: 21,
            price: 3690,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_21"
                : "price_prod_scale_yearly_21",
          },
          {
            websites: 22,
            price: 3840,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_22"
                : "price_prod_scale_yearly_22",
          },
          {
            websites: 23,
            price: 3990,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_23"
                : "price_prod_scale_yearly_23",
          },
          {
            websites: 24,
            price: 4140,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_24"
                : "price_prod_scale_yearly_24",
          },
          {
            websites: 25,
            price: 4290,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_25"
                : "price_prod_scale_yearly_25",
          },
          {
            websites: 26,
            price: 4440,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_26"
                : "price_prod_scale_yearly_26",
          },
          {
            websites: 27,
            price: 4590,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_27"
                : "price_prod_scale_yearly_27",
          },
          {
            websites: 28,
            price: 4740,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_28"
                : "price_prod_scale_yearly_28",
          },
          {
            websites: 29,
            price: 4890,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_29"
                : "price_prod_scale_yearly_29",
          },
          {
            websites: 30,
            price: 5040,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_30"
                : "price_prod_scale_yearly_30",
          },
          {
            websites: 31,
            price: 5190,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_31"
                : "price_prod_scale_yearly_31",
          },
          {
            websites: 32,
            price: 5340,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_32"
                : "price_prod_scale_yearly_32",
          },
          {
            websites: 33,
            price: 5490,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_33"
                : "price_prod_scale_yearly_33",
          },
          {
            websites: 34,
            price: 5640,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_34"
                : "price_prod_scale_yearly_34",
          },
          {
            websites: 35,
            price: 5790,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_35"
                : "price_prod_scale_yearly_35",
          },
          {
            websites: 36,
            price: 5940,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_36"
                : "price_prod_scale_yearly_36",
          },
          {
            websites: 37,
            price: 6090,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_37"
                : "price_prod_scale_yearly_37",
          },
          {
            websites: 38,
            price: 6240,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_38"
                : "price_prod_scale_yearly_38",
          },
          {
            websites: 39,
            price: 6390,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_39"
                : "price_prod_scale_yearly_39",
          },
          {
            websites: 40,
            price: 6540,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_40"
                : "price_prod_scale_yearly_40",
          },
          {
            websites: 41,
            price: 6690,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_41"
                : "price_prod_scale_yearly_41",
          },
          {
            websites: 42,
            price: 6840,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_42"
                : "price_prod_scale_yearly_42",
          },
          {
            websites: 43,
            price: 6990,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_43"
                : "price_prod_scale_yearly_43",
          },
          {
            websites: 44,
            price: 7140,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_44"
                : "price_prod_scale_yearly_44",
          },
          {
            websites: 45,
            price: 7290,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_45"
                : "price_prod_scale_yearly_45",
          },
          {
            websites: 46,
            price: 7440,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_46"
                : "price_prod_scale_yearly_46",
          },
          {
            websites: 47,
            price: 7590,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_47"
                : "price_prod_scale_yearly_47",
          },
          {
            websites: 48,
            price: 7740,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_48"
                : "price_prod_scale_yearly_48",
          },
          {
            websites: 49,
            price: 7890,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_49"
                : "price_prod_scale_yearly_49",
          },
          {
            websites: 50,
            price: 8040,
            priceId:
              process.env.NODE_ENV === "development"
                ? "price_dev_scale_yearly_50"
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
