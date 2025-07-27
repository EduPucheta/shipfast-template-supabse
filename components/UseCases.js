import { useTranslation as getTranslation } from "@/app/i18n";
import { cookies } from "next/headers";
import ButtonCheckout from "@/components/ButtonCheckout";

const UseCaseCard = ({ emoji, title, description, useCase, metrics }) => {
  return (
    <div className="bg-base-200 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-base-content/70 text-sm mb-4">{description}</p>
      <div className="bg-base-300 rounded-lg p-3 mb-3">
        <p className="text-xs font-medium text-primary">{useCase}</p>
      </div>
      {metrics && (
        <div className="flex items-center gap-2 text-xs text-success">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>{metrics}</span>
        </div>
      )}
    </div>
  );
};

const UseCases = async ({ lang }) => {
  const cookieValue = cookies().get("i18next")?.value;
  const lng = lang || cookieValue || 'en';
  
  const { t } = await getTranslation(lng);

  const useCases = [
    {
      emoji: "🛍️",
      title: t("useCases.ecommerce.title", "E-commerce Store"),
      description: t("useCases.ecommerce.description", "Online retailers use Feedbackito to understand customer satisfaction after purchases and improve their shopping experience."),
      useCase: t("useCases.ecommerce.useCase", ""How was your shopping experience?" - Post-purchase surveys"),
      metrics: t("useCases.ecommerce.metrics", "+32% repeat purchases")
    },
    {
      emoji: "🏥",
      title: t("useCases.healthcare.title", "Healthcare Clinic"),
      description: t("useCases.healthcare.description", "Medical practices collect patient feedback to improve care quality and streamline appointment processes."),
      useCase: t("useCases.healthcare.useCase", ""Rate your visit today" - Patient satisfaction surveys"),
      metrics: t("useCases.healthcare.metrics", "4.8/5 patient satisfaction")
    },
    {
      emoji: "🎓",
      title: t("useCases.education.title", "Online Course Platform"),
      description: t("useCases.education.description", "Educators gather student feedback to improve course content and teaching methods."),
      useCase: t("useCases.education.useCase", ""How was this lesson?" - Course evaluation forms"),
      metrics: t("useCases.education.metrics", "95% course completion rate")
    },
    {
      emoji: "🏨",
      title: t("useCases.hospitality.title", "Hotel Chain"),
      description: t("useCases.hospitality.description", "Hotels use guest feedback to enhance service quality and identify areas for improvement."),
      useCase: t("useCases.hospitality.useCase", ""How was your stay?" - Guest experience surveys"),
      metrics: t("useCases.hospitality.metrics", "+45% positive reviews")
    },
    {
      emoji: "💻",
      title: t("useCases.saas.title", "SaaS Company"),
      description: t("useCases.saas.description", "Software companies track user satisfaction and feature requests to guide product development."),
      useCase: t("useCases.saas.useCase", ""What features do you need?" - Product feedback forms"),
      metrics: t("useCases.saas.metrics", "3x faster feature adoption")
    },
    {
      emoji: "🍔",
      title: t("useCases.restaurant.title", "Restaurant Chain"),
      description: t("useCases.restaurant.description", "Restaurants collect diner feedback to improve menu offerings and service quality."),
      useCase: t("useCases.restaurant.useCase", ""Rate your meal" - Dining experience surveys"),
      metrics: t("useCases.restaurant.metrics", "+28% customer retention")
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {t("useCases.title", "How Businesses Use Feedbackito")}
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t("useCases.subtitle", "Discover how different industries leverage AI-powered survey analysis to transform customer feedback into actionable insights")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} {...useCase} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-base-content/60 mb-4">
            {t("useCases.cta", "Join thousands of businesses improving with customer feedback")}
          </p>
          <ButtonCheckout 
            priceId={process.env.NODE_ENV === "development" ? "price_1R2HPPIPjutGjJ5SoNiP5bgq" : "price_1RnQuaIPjutGjJ5SWhDIor7k"}
            mode="payment"
          />
        </div>
      </div>
    </section>
  );
};

export default UseCases;