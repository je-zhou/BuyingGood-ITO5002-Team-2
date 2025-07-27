"use client";

import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-4 w-full">
      <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <h1 className="text-xl md:text-2xl">
            <span className="text-black/70">Buying</span>
            <span className="text-primary font-bold">Good</span>
          </h1>
        </Link>

        {/* User Profile */}
        <div className="flex items-center">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}