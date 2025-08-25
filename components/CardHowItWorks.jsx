import { cookies } from "next/headers";
import { useTranslation as getTranslation } from "@/app/i18n";
import Card from "@/components/ui/card";
import Image from "next/image";

export default async function CardHowItWorks({ lang }) {
  const lng = lang || (await cookies()).get("i18next")?.value || "en";
  const { t } = await getTranslation(lng);

  const steps = t("howItWorks.steps", { returnObjects: true });

  // Define images for each step
  const stepImages = [
    "/images/step-1-create.png", // Create survey image
    "/images/step-2-embed.png",  // Embed widget image
    "/images/step-3-analyze.png" // Analyze results image
  ];

  return (
    <section className="py-24 md:py-32 bg-base-100">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
          {t("howItWorks.eyebrow")}
        </p>
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-4">
          {t("howItWorks.title")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          {Array.isArray(steps) && steps.map((step, idx) => (
            <Card key={idx} className="border border-base-200 hover:shadow-2xl transition-shadow">
              <div className="p-6 md:p-8 h-full flex flex-col">
                {/* Step Image */}
                <div className="mb-6 flex justify-center">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Image
                      src={stepImages[idx] || "/images/step-placeholder.png"}
                      alt={`Step ${idx + 1}: ${step.title}`}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                    {/* Fallback icon overlay - will show if image fails to load */}
                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-primary/60 bg-base-100/80 opacity-0 hover:opacity-100 transition-opacity">
                      {idx === 0 && "📝"}
                      {idx === 1 && "🔗"}
                      {idx === 2 && "📊"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-content font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-xl font-semibold leading-snug">
                    {step.title}
                  </h3>
                </div>
                <p className="text-base-content/70 leading-relaxed flex-1">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


