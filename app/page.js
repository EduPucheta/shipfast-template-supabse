import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Testimonial from "@/components/Testimonials1";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SignUpPresale from "@/components/SignUpPresale"; 
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import UseCases from "@/components/UseCases";
import { cookies } from "next/headers";


export default function Page() {
  const lng = cookies().get("i18next")?.value || "en";

  return (
    <>
      <div className="bg-base-100">
        <Suspense fallback={<div className="h-16 bg-base-100" />}>
          <Header lang={lng}/>
        </Suspense>
       

        <HeroSection lang={lng}/>
        <Problem lang={lng}/> 
        <UseCases lang={lng}/>
        <FeaturesAccordion lang={lng}/>
        <Pricing lang={lng}/>
        <FAQ lang={lng}/>
       
        <CTA lang={lng}/>
        <Footer lang={lng}/>
      </div>
    </> 
  );
}
