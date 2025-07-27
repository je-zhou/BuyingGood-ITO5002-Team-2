"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      // Navigate to home page first, then scroll after navigation
      router.push(`/#${sectionId}`);
    } else {
      // Already on home page, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Handle scrolling when page loads with hash fragment
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [pathname]);

  return (
    <nav className="flex justify-between items-center p-4 w-full border-b border-gray-200">
      {/* Icon and Brand */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <h1 className="text-2xl ">
          <span className="text-black/70">Buying</span>
          <span className="text-primary font-bold">Good</span>
        </h1>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-12">
        <Link href={"/farms"} className="hover:text-primary cursor-pointer">
          Nearby Farms
        </Link>
        <button
          onClick={() => scrollToSection("our-story")}
          className="hover:text-primary cursor-pointer"
        >
          Our Story
        </button>
        <button
          onClick={() => scrollToSection("data-viz")}
          className="hover:text-primary cursor-pointer"
        >
          The Problem in Numbers
        </button>
        <button
          onClick={() => scrollToSection("our-solution")}
          className="hover:text-primary cursor-pointer"
        >
          Our Solution
        </button>
        <button
          onClick={() => scrollToSection("testimonials")}
          className="hover:text-primary cursor-pointer"
        >
          Testimonials
        </button>
      </div>

      {/* CTA button */}
      <div>
        <SignedOut>
          <Link href="/sign-up">
            <Button
              variant={"outline"}
              className="border-primary text-primary font-medium cursor-pointer hover:bg-primary hover:text-white"
            >
              I&apos;m a Farmer
            </Button>
          </Link>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button
                variant={"outline"}
                className="border-primary text-primary font-medium cursor-pointer hover:bg-primary hover:text-white"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
