"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import config from "@/config";
import SignUpPresale from "@/components/SignUpPresale";
import TestimonialsAvatars from "@/components/TestimonialsAvatars";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useTranslation } from "@/app/i18n/client";

const HeroSection = () => {
  const [subscriberCount, setSubscriberCount] = useState("...");
  const supabase = createClientComponentClient();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchSubscriberCount() {
      const { count } = await supabase
        .from("presale_subscribers")
        .select("*", { count: "exact", head: true });

      setSubscriberCount(count || 0);
    }

    fetchSubscriberCount();
  }, [supabase]);

  return (
    <div className=" min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12 bg-base-100">
      <div className="max-w-7xl w-full mx-auto py-16 flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start items-center gap-2 mb-5"></div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2 leading-tight">
            {t('heroSection.title')}
            <br />
            {" "}
            <span className="bg-neutral text-neutral-content px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed whitespace-nowrap">
              {t('heroSection.titleHighlight')}
            </span>
          </h1>
          <p className="text-2xl mb-6 max-w-2xl mx-auto lg:mx-0 text-gray-500">
            {t('heroSection.subtitle')}
          </p>



          <SignUpPresale
            onSubscribeSuccess={() =>
              setSubscriberCount((prev) => (prev === "..." ? 1 : prev + 1))
            }
          />
          <TestimonialsAvatars subscriberCount={subscriberCount} />
        </div>
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end">
          <video
            src="/HeroVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-md lg:max-w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
