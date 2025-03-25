import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Testimonial from "@/components/Testimonials1";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SignUpPresale from "@/components/SignUpPresale"; 

export default function Page() {
  return (
    <>
      <div>
        <Suspense fallback={<div className="h-16 bg-base-100" />}>
          <Header/>
        </Suspense>
        <HeroSection/>
        <Pricing/>
        <FAQ/>
        <Testimonial/>
        <CTA/>
        <Footer/>
      </div>
    </> 
  );
}
