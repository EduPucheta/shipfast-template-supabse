import { cookies } from "next/headers";
import { useTranslation as getTranslation } from "@/app/i18n";
import Card from "@/components/ui/card";
import Image from "next/image";

export default async function CardHowItWorks({ lang }) {
  const lng = lang || (await cookies()).get("i18next")?.value || "en";
  const { t } = await getTranslation(lng);

  const steps = t("howItWorks.steps", { returnObjects: true });

  const stepImages = [
    "/Feedbackito-script.png", 
    "/SurveyCreation.png",
    "/Dashboard-Image.png", 
  ];

  return (
    <section className="py-24 md:py-32 bg-base-100">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
         
        </p>
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-4">
        {t("howItWorks.eyebrow")}
        </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-8 lg:items-stretch">
          {Array.isArray(steps) &&
            steps.map((step, idx) => (
              <div key={idx} className="relative lg:flex">
                <Card className="border border-base-200 hover:shadow-2xl transition-shadow lg:w-full overflow-hidden">
                  <Image
                    src={stepImages[idx]}
                    alt={step.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-6 md:p-8 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-content font-bold">
                        {idx + 1}
                      </span>
                      <h3 className="text-xl font-semibold leading-snug">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-base-content/70 leading-relaxed flex-1">
                      {step.description}
                    </p>
                  </div>
                </Card>

                {/* Simple arrow - only show if not the last card */}
                {idx < steps.length - 1 && (
                  <div className="flex justify-center mt-4 lg:mt-0 lg:absolute lg:top-1/2 lg:left-full lg:transform lg:-translate-y-1/2 lg:w-8">
                    <svg 
                      className="w-5 h-5 text-primary/40 lg:rotate-0 rotate-90" 
                    
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}


