import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="w-full bg-gray-100 p-8 flex flex-col justify-between items-center gap-4">
      {/* NavLinks */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/">Home</Link>
          <Link href="/about">Our Story</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-400 my-4"></div>

      {/*Logo*/}
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <h1 className="text-2xl ">
          <span className="text-black/70">Buying</span>
          <span className="text-primary font-bold">Good</span>
        </h1>
      </div>

      {/* Copyright */}
      <div className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Buying Good. All rights reserved.
      </div>
    </div>
  );
}
