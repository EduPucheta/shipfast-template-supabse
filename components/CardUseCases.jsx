import { cookies } from "next/headers";
import { useTranslation as getTranslation } from "@/app/i18n";
import Card from "@/components/ui/card";

export default async function CardUseCases({ lang }) {
  const lng = lang || (await cookies()).get("i18next")?.value || "en";
  const { t } = await getTranslation(lng);

  const items = t("useCases.items", { returnObjects: true });

  return (
    <section className="py-24 md:py-32 bg-base-100">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-4">
          {t("useCases.title")} <span className="bg-neutral text-neutral-content px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed whitespace-nowrap">{t("useCases.titleHighlight")}</span>
        </h2>
        <p className="text-base-content/70 mb-10 md:mb-14 max-w-3xl">{t("useCases.subtitle")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.isArray(items) && items.map((item, idx) => (
            <Card key={idx} className="hover:shadow-2xl border border-base-200 transition-shadow">
              <div className="p-6 md:p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                    {/* Simple spark icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.68.444l1.679 3.58 3.91.493a.75.75 0 01.403 1.303l-2.94 2.685.79 3.86a.75.75 0 01-1.094.82L12 13.93l-3.338 1.506a.75.75 0 01-1.094-.82l.79-3.86-2.94-2.685a.75.75 0 01.403-1.303l3.91-.493L11.32 2.694A.75.75 0 0112 2.25z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h3 className="text-xl font-semibold leading-snug">{item.title}</h3>
                </div>
                <p className="text-base-content/70 leading-relaxed flex-1">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


