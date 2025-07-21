import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import Link from "next/link";

export default function LandingHero() {
  return (
    <div className="flex flex-col h-screen pb-32 justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-primary">Buying Good</span>
        </h1>
        <p className="text-gray-500 max-w-2xl text-center">
          We are a non-for profit initiative that helps connect you with local
          farmers and challenge the wasteful logistical practices of large food
          distributors.
        </p>

        <div className="pt-8 w-full">
          <SearchBar />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-500">
            Are you a farmer?{" "}
            <Link href="/sign-up" className="text-primary">
              Register your farm
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
