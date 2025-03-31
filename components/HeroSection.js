"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import Image from "next/image";
import config from "@/config";
import SignUpPresale from "@/components/SignUpPresale";
import TestimonialsAvatars from "@/components/TestimonialsAvatars";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const HeroSection = () => {
  const [subscriberCount, setSubscriberCount] = useState("...");
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchSubscriberCount() {
      const { count } = await supabase
        .from("presale_subscribers")
        .select("*", { count: "exact", head: true });

      setSubscriberCount(count || 0);
    }

    fetchSubscriberCount();
  }, []);

  return (
    <div className=" min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12 bg-base-100">
      <div className="max-w-7xl w-full mx-auto py-16 flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start items-center gap-2 mb-5"></div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Collect feedback
            <br />
            and talk to it{" "}
            <span className="bg-[#CFCFCF] text-[#2E1A05] px-2">with AI</span>
          </h1>

          <p className="text-base  mb-8 max-w-2xl mx-auto lg:mx-0">
            Transform your survey responses into meaningful conversations. Ask
            questions, get insights, and understand your data like never before.
            Our AI assistant helps you make sense of feedback by analyzing
            patterns and providing actionable insights - all through natural
            dialogue.
          </p>

          <SignUpPresale
            onSubscribeSuccess={() =>
              setSubscriberCount((prev) => (prev === "..." ? 1 : prev + 1))
            }
          />
          <TestimonialsAvatars subscriberCount={subscriberCount} />
        </div>
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end">
          <Image
            src="/image.png"
            alt="Hero image"
            width={500}
            height={500}
            className="w-full max-w-md lg:max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
