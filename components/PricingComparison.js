"use client";
import { useTranslation } from '@/app/i18n/client';
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";
import Link from "next/link";

const PricingComparison = ({ lang }) => {
  const { t } = useTranslation(lang);

  // Calculate Feedbackito pricing for 200 responses
  const calculateFeedbackitoPrice = (responses) => {
    // Based on your config, for 200 responses you'd need the Scale plan
    // Since 200 responses is beyond the 100 free limit, user needs Pro plan
    // Pro plan has unlimited responses for $29/month
    return 29;
  };

  const feedbackitoPrice = calculateFeedbackitoPrice(200);
  const competitors = [
    {
      name: "Hotjar",
      price: 59, // Plus plan
      responses: "500 responses",
      features: ["Unlimited surveys", "Hotjar logo", "No AI analysis"],
      color: "bg-orange-500"
    },
    {
      name: "Survicate",
      price: 92, // Pro plan
      responses: "100 responses",
      features: ["Basic analytics", "Custom branding", "2 years data retention"],
      color: "bg-blue-500"
    },
    {
      name: "Survio",
      price: 50, // Team Advantage plan
      responses: "3000 responses",
      features: ["Advanced analytics", "Team collaboration", "Custom themes"],
      color: "bg-purple-500"
    },
    {
      name: "Qualtrics",
      price: 1500, // Research Core plan
      responses: "Unlimited",
      features: ["Advanced research tools", "Statistical analysis", "Enterprise features"],
      color: "bg-red-500"
    }
  ];

  return (
    <section className="bg-base-100 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">
            {t('pricingComparison.title')}
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            {t('pricingComparison.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {/* Feedbackito Card - Highlighted */}
          <div className="relative order-first lg:col-span-2 xl:col-span-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25"></div>
            <div className="relative bg-base-100 p-8 rounded-2xl border-2 border-primary shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <img src="/icon.png" alt="Feedbackito" className="w-8 h-8 filter brightness-0 invert" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Feedbackito Pro</h3>
                    <p className="text-sm text-base-content/70">Unlimited responses</p>
                  </div>
                </div>
                <div className="badge badge-primary badge-lg">BEST VALUE</div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">${feedbackitoPrice}</span>
                  <span className="text-base-content/70">/month</span>
                </div>
            
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">AI-powered analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Unlimited surveys</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Actionable insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">No branding</span>
                </li>
              </ul>

              <div className="text-center">
                <ButtonCheckout 
                  priceId={config.stripe.plans.find(p => p.name === "Pro")?.priceId}
                  className="btn btn-primary btn-lg w-full"
                >
                  {t('pricingComparison.getStarted')}
                </ButtonCheckout>
              </div>
            </div>
          </div>

          {/* Competitor Cards */}
          {competitors.map((competitor, index) => (
            <div key={index} className="bg-base-200 p-6 rounded-xl border border-base-300">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${competitor.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {competitor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{competitor.name}</h3>
                  <p className="text-sm text-base-content/70">{competitor.responses}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {competitor.price === 0 ? 'Free' : `$${competitor.price}`}
                  </span>
                  {competitor.price > 0 && <span className="text-base-content/70">/month</span>}
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {competitor.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-base-content/20 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>


            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-base-200 p-6 rounded-xl max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">{t('pricingComparison.whyChoose')}</h3>
            <p className="text-base-content/70 mb-4">
              {t('pricingComparison.whyChooseText')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="badge badge-primary badge-lg">AI Analysis</div>
              <div className="badge badge-secondary badge-lg">Unlimited Surveys</div>
              <div className="badge badge-accent badge-lg">Custom Branding</div>
              <div className="badge badge-info badge-lg">Actionable Insights</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;
