"use client";
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from '@/app/i18n/client';

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = ({ lang }) => {
  const { t } = useTranslation(lang);
  const [billing, setBilling] = useState("monthly");
  // State for the slider quantity
  const [quantity, setQuantity] = useState(config.stripe.plans.find(p => p.isSlider)?.slider.min || 2);

  const freePlan = config.stripe.plans.find((plan) => plan.price === 0);
  const paidPlans =
    billing === "monthly"
      ? config.stripe.plans.filter((plan) => plan.price !== 0 && !plan.isSlider)
      : config.stripe.plans_annual.filter((plan) => !plan.isSlider && plan.price !== 0);

  const sliderPlan =
    billing === "monthly"
      ? config.stripe.plans.find((plan) => plan.isSlider)
      : config.stripe.plans_annual.find((plan) => plan.isSlider);

  // The rendering order of the plans is determined by the order in the config file.
  // The free plan is always first.
  const plans = [freePlan, ...paidPlans].filter(Boolean);

  // If a slider plan exists, it's rendered separately
  if (sliderPlan) {
    plans.push(sliderPlan);
  }


  return (
    <section className="bg-base-200 overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">{t('pricing.title')}</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            {t('pricing.subtitle')}
          </h2>
        </div>
        <div className="flex justify-center items-center gap-4 mb-12">
          <p
            className={`font-semibold transition-colors ${
              billing === "monthly" ? "text-primary" : "text-base-content/70"
            }`}
          >
            {t('pricing.monthly')}
          </p>

          <input
            type="checkbox"
            className="toggle toggle-primary"
            // When checked, the toggle is on and we want to show the annual plans
            checked={billing === "yearly"}
            onChange={(e) =>
              setBilling(e.target.checked ? "yearly" : "monthly")
            }
          />

          <p 
            className={`font-semibold transition-colors ${
              billing === "yearly" ? "text-primary" : "text-base-content/70"
            }`}
          >
            {t('pricing.yearly')}
          </p>
          <span className="badge badge-primary animate-pulse tracking-wide">
            {t('pricing.monthsFree')}
          </span>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {plans.map((plan) => (
            plan.isSlider ? (
              <div key={plan.name} className="relative w-full max-w-lg mx-auto lg:col-span-1">
                {plan.isFeatured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <span
                      className={`badge text-xs text-primary-content font-semibold border-0 bg-primary`}
                    >
                      {t('pricing.popular')}
                    </span>
                  </div>
                )}

                {plan.isFeatured && (
                  <div
                    className={`absolute -inset-[1px] rounded-[9px] bg-primary z-10`}
                  ></div>
                )}
                
                <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <p className="text-lg lg:text-xl font-bold">
                        {t(plan.name)}
                      </p>
                      {plan.description && (
                        <p className="text-base-content/80 mt-2">
                          {t(plan.description)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-5xl tracking-tight font-extrabold`}>
                        ${plan.pricing(quantity)}
                      </p>
                      <p className="text-xs text-base-content/60 uppercase font-semibold">
                        USD
                      </p>
                    </div>
                    {quantity > 0 && (
                      <p className="text-sm text-base-content/70">
                        ${(plan.pricing(quantity) / quantity).toFixed(2)} / {t('pricing.website')}
                      </p>
                    )}
                  </div>
                  
                  <div className="w-full">
                    <div className="w-full text-center">
                      <div className="badge badge-neutral mb-2">
                        {t('pricing.upTo')} {quantity}{" "}
                        <span>
                          {quantity === 1
                            ? t('pricing.website')
                            : t('pricing.websites')}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={plan.slider.min}
                        max={plan.slider.max}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="range range-primary"
                        step={plan.slider.step}
                      />
                      <div className="w-full flex justify-between text-xs px-2 mt-2">
                        <span>{plan.slider.min}</span>
                        <span>{plan.slider.max}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-[18px] h-[18px] opacity-80 shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <span>
                        {t('pricing.upTo')}{" "}
                        <span className="font-semibold">
                         {quantity}
                        </span>{" "}
                        <span
                          className="tooltip underline cursor-pointer"
                          data-tip={t('pricing.websiteTooltip')}
                        >
                          {quantity === 1
                            ? t('pricing.website')
                            : t('pricing.websites')}
                        </span>
                      </span>
                    </li>
                    
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-[18px] h-[18px] opacity-80 shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span>{t(feature.name)} </span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-y-2">
                    {plan.priceId ? (
                      <ButtonCheckout priceId={plan.priceId} quantity={quantity} />
                    ) : (
                      <button className="btn btn-primary btn-block" disabled>
                        {t('pricing.contactUs')}
                      </button>
                    )}

                    <p className="flex items-center justify-center gap-2 text-sm text-center text-base-content/80 font-medium relative">
                      {billing === "monthly"
                        ? t('pricing.billedMonthly')
                        : t('pricing.billedYearly')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={plan.priceId || plan.name} className="relative w-full max-w-lg mx-auto lg:col-span-1">
                {plan.isFeatured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <span
                      className={`badge text-xs text-primary-content font-semibold border-0 bg-primary`}
                    >
                      {t('pricing.popular')}
                    </span>
                  </div>
                )}

                {plan.isFeatured && (
                  <div
                    className={`absolute -inset-[1px] rounded-[9px] bg-primary z-10`}
                  ></div>
                )}

                <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <p className="text-lg lg:text-xl font-bold">{t(plan.name)}</p>
                      {plan.description && (
                        <p className="text-base-content/80 mt-2">
                          {t(plan.description)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {plan.priceAnchor && (
                      <div className="flex flex-col justify-end mb-[4px] text-lg ">
                        <p className="relative">
                          <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[53%]"></span>
                          <span className="text-base-content/80">
                            ${plan.priceAnchor}
                          </span>
                        </p>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <p className={`text-5xl tracking-tight font-extrabold`}>
                        {typeof plan.price === "number" ? "$" + plan.price : plan.price}
                      </p>
                      <p className="text-xs text-base-content/60 uppercase font-semibold">
                        USD 
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                             className="w-[18px] h-[18px] opacity-80 shrink-0"
                        >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                        </svg>

                        <span>{t(feature.name)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2">
                    {plan.price === 0 ? (
                      <Link
                        href={`/signin`}
                        className="btn btn-primary btn-block"
                      >
                        {t('pricing.getStarted')}
                      </Link>
                    ) : (
                      <ButtonCheckout priceId={plan.priceId} />
                    )}

                    <p className="flex items-center justify-center gap-2 text-sm text-center text-base-content/80 font-medium relative">
                      {plan.price === 0
                        ? t('pricing.noCreditCard')
                        : billing === "monthly"
                        ? t('pricing.billedMonthly')
                        : t('pricing.billedYearly')}
                    </p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
