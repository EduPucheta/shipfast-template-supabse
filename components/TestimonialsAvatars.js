"use client";

import React from "react";
import Image from "next/image";

const avatars = [
  {
    alt: "User",
    // Ideally, load from a statically generated image for better SEO performance (import userImage from "@/public/userImage.png")
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3276&q=80",
  },
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    alt: "User",
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3376&q=80",
  },
];

export default function TestimonialsAvatars({ subscriberCount }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center -space-x-4">
        {/* AVATARS */}
        <div className={`-space-x-5 avatar-group justify-start`}>
          {avatars.map((image, i) => (
            <div className="avatar w-12 h-12" key={i}>
              <Image
                src={image.src}
                alt={image.alt}
                width={50}
                height={50}
              />
            </div>
          ))}
        </div>

        {/* RATING */}
        <div className="flex flex-col justify-center items-center md:items-start gap-1 pl-4 ">
          <p className="text-center text-base-content/80">
            Join our <span className="font-semibold text-base-content">{subscriberCount}</span> subscribers 
          </p> 
        </div>
      </div>
    </div>
  );
}
