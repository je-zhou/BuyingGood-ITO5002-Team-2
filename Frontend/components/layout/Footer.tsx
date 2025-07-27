"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8 flex flex-col justify-between items-center gap-4">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center gap-4">
        {/* NavLinks */}
        <div className="flex justify-center items-center">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-sm md:text-base">
            <Link href="/farms" className="hover:text-primary cursor-pointer px-2 py-1">
              Nearby Farms
            </Link>
            <button
              onClick={() => scrollToSection("our-story")}
              className="hover:text-primary cursor-pointer px-2 py-1"
            >
              Our Story
            </button>
            <button
              onClick={() => scrollToSection("data-viz")}
              className="hover:text-primary cursor-pointer px-2 py-1 text-center"
            >
              The Problem in Numbers
            </button>
            <button
              onClick={() => scrollToSection("our-solution")}
              className="hover:text-primary cursor-pointer px-2 py-1"
            >
              Our Solution
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="hover:text-primary cursor-pointer px-2 py-1"
            >
              Testimonials
            </button>
            <Link href="/privacy" className="hover:text-primary cursor-pointer px-2 py-1">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-400 my-2 md:my-4"></div>

        {/*Logo*/}
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <h1 className="text-xl md:text-2xl">
            <span className="text-black/70">Buying</span>
            <span className="text-primary font-bold">Good</span>
          </h1>
        </div>

        {/* Copyright */}
        <div className="text-xs md:text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Buying Good. All rights reserved.
        </div>
      </div>
    </div>
  );
}
