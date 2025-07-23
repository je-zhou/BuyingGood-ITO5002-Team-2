import React from "react";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";

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
        <Link href="/about">Nearby Farms</Link>
        <Link href="/about">Our Story</Link>
        <Link href="/contact">Contact Us</Link>
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
