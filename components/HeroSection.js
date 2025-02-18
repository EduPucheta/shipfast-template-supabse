import Link from "next/link";
import { Zap } from "lucide-react";
import Image from "next/image";
import config from "@/config";

const HeroSection = () => { 
  return (
    <div className=" min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl w-full mx-auto py-16 flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start items-center gap-2 mb-5">
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Start colleting feedback
            <br />
            now,{" "}
            <span className="bg-[#CFCFCF] text-[#2E1A05] px-2">dont wait</span>
          </h1>

          <p className="text-base  mb-8 max-w-2xl mx-auto lg:mx-0">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum
            est, perspiciatis nisi assumenda cum reprehenderit cumque laboriosam
            earum doloribus tempore dolor, veritatis aliquid ipsam eum nihil
            possimus excepturi in asperiores! Natus quibusdam quos laboriosam.
            Asperiores eos esse culpa labore volupt
          </p>

          <Link
            href="https://github.com/idee8/shipfree"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-5 items-center justify-center gap-2 bg-[#FFBE1A] hover:bg-yellow-500 text-black px-8 sm:px-20 py-3 rounded-xl font-medium text-lg mb-6 duration-300 transition-colors"
          >
            <Zap fill="#000000" className="w-5 h-5" />
            Get started with {config.appName}
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <div className="flex -space-x-3">
              {[
                "https://pbs.twimg.com/profile_images/1490075268928655364/L-PTx3nW_400x400.jpg",
                "https://pbs.twimg.com/profile_images/1855635236509388800/PFMQ949e_400x400.jpg",
                "https://pbs.twimg.com/profile_images/933422170499371008/drhhIn0z_400x400.jpg",
                "https://pbs.twimg.com/profile_images/1870096957370445827/PQrjfHGt_400x400.jpg",
                "https://pbs.twimg.com/profile_images/1850639995444371456/9rbx-lYe_400x400.jpg",
              ].map((avatar, index) => (
                <img
                  key={index}
                  src={avatar || "/placeholder.svg"}
                  alt={`User ${index + 1}`}
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-zinc-900"
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-100 mt-1 text-sm sm:text-base">
                  <span className="font-medium">6301</span>
                  <span className="text-zinc-400 ml-2">makers ship faster</span>
                </p>
              </div>
            </div>
          </div>
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
