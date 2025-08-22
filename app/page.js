import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Pricing from "@/components/Pricing";
import PricingComparison from "@/components/PricingComparison";
import FAQ from "@/components/FAQ";

import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
 
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import CardUseCases from "@/components/CardUseCases";
import { cookies } from "next/headers";


export default async function Page() {
  const lng = (await cookies()).get("i18next")?.value || "en";

  return (
    <>
      <div className="bg-base-100">
        <Suspense fallback={<div className="h-16 bg-base-100" />}>
          <Header lang={lng}/>
        </Suspense>
       

        <HeroSection lang={lng}/>
        <Problem lang={lng}/> 
        <FeaturesAccordion lang={lng}/>
        <CardUseCases lang={lng} />
        <Pricing lang={lng}/>
        <PricingComparison lang={lng}/>
        <FAQ lang={lng}/>

        <CTA lang={lng}/>
        <Footer lang={lng}/>
      </div>
    </> 
  );
}
