"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <>
      <div className="w-full border-b border-gray-200">
        <nav className="flex justify-between items-center p-4 w-full max-w-screen-2xl mx-auto">
          {/* Icon and Brand */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <h1 className="text-xl md:text-2xl">
              <span className="text-black/70">Buying</span>
              <span className="text-primary font-bold">Good</span>
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
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

          {/* Desktop CTA button */}
          <div className="hidden md:block">
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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex flex-col gap-4">
            <Link 
              href={"/farms"} 
              className="hover:text-primary cursor-pointer py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Nearby Farms
            </Link>
            <button
              onClick={() => {
                scrollToSection("our-story");
                setIsMenuOpen(false);
              }}
              className="hover:text-primary cursor-pointer text-left py-2"
            >
              Our Story
            </button>
            <button
              onClick={() => {
                scrollToSection("data-viz");
                setIsMenuOpen(false);
              }}
              className="hover:text-primary cursor-pointer text-left py-2"
            >
              The Problem in Numbers
            </button>
            <button
              onClick={() => {
                scrollToSection("our-solution");
                setIsMenuOpen(false);
              }}
              className="hover:text-primary cursor-pointer text-left py-2"
            >
              Our Solution
            </button>
            <button
              onClick={() => {
                scrollToSection("testimonials");
                setIsMenuOpen(false);
              }}
              className="hover:text-primary cursor-pointer text-left py-2"
            >
              Testimonials
            </button>
            
            {/* Mobile CTA */}
            <div className="pt-4 border-t border-gray-200">
              <SignedOut>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant={"outline"}
                    className="border-primary text-primary font-medium cursor-pointer hover:bg-primary hover:text-white w-full"
                  >
                    I&apos;m a Farmer
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={"outline"}
                      className="border-primary text-primary font-medium cursor-pointer hover:bg-primary hover:text-white w-full"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex justify-center pt-2">
                    <UserButton />
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
