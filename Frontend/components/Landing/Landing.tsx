import React from "react";
import LandingHero from "./Hero";
import OurStory from "./OurStory";
import OurSolution from "./OurSolution";
import WhatsInItForYou from "./WhatsInItForYou";

export default function Landing() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <LandingHero />
      <div className="flex flex-col gap-72 pb-40">
        <OurStory />
        <OurSolution />
        <WhatsInItForYou />
      </div>
    </div>
  );
}
