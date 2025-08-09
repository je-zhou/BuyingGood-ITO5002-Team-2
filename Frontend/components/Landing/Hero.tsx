"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SearchBar from "../SearchBar/SearchBar";

export default function LandingHero() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoaded && user) {
      // If user is signed in, redirect to their farm creation page
      router.push(`/dashboard/${user.id}/my-farms/create`);
    } else {
      // If user is not signed in, go to sign-up page
      router.push("/sign-up");
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-32 justify-center items-center px-4">
      <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          Welcome to{" "}
          <span className="text-black/70">
            Buying<span className="text-primary">Good</span>
          </span>
        </h1>
        <p className="text-gray-500 max-w-2xl text-center text-sm md:text-base">
          We are a non-for profit initiative that helps connect you with local
          farmers and challenge the wasteful logistical practices of large food
          distributors.
        </p>

        <div className="pt-4 md:pt-8 w-full">
          <SearchBar />
        </div>

        <div className="flex flex-col items-center gap-2 pt-4 md:pt-8">
          <p className="text-xs md:text-sm text-gray-500 text-center">
            Are you a farmer?{" "}
            <button
              onClick={handleRegisterClick}
              className="text-primary hover:underline cursor-pointer"
            >
              Register your farm
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
