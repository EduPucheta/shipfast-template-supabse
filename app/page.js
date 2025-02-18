
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Testimonial from "@/components/Testimonials1";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <div>
        <Header/>
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
