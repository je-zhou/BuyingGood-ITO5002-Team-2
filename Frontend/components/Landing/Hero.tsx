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
    <div className="flex flex-col h-screen pb-32 justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">
          Welcome to{" "}
          <span className="text-black/70">
            Buying<span className="text-primary">Good</span>
          </span>
        </h1>
        <p className="text-gray-500 max-w-2xl text-center">
          We are a non-for profit initiative that helps connect you with local
          farmers and challenge the wasteful logistical practices of large food
          distributors.
        </p>

        <div className="pt-8 w-full">
          <SearchBar />
        </div>

        <div className="flex flex-col items-center gap-2 pt-8">
          <p className="text-sm text-gray-500">
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
