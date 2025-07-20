import React from "react";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 w-full">
      {/* Icon and Brand */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <h1 className="text-2xl ">
          <span className="text-black/70">Buying</span>
          <span className="text-primary font-bold">Good</span>
        </h1>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-4">
        <Link href="/about">Our Story</Link>
        <Link href="/contact">Contact Us</Link>
      </div>

      {/* CTA button */}
      <div>
        <SignedOut>
          <Link href="/sign-up">
            <button className="bg-primary text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              I&apos;m a Farmer
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
