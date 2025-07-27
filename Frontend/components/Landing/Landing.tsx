import React from "react";
import LandingHero from "./Hero";
import OurStory from "./OurStory";
import OurSolution from "./OurSolution";
import WhatsInItForYou from "./WhatsInItForYou";
import Testimonials from "./Testimonials";
import DataViz from "./DataViz";

export default function Landing() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <div id="nearby-farms">
        <LandingHero />
      </div>
      <div className="flex flex-col gap-16 md:gap-32 lg:gap-72 pb-16 md:pb-24 lg:pb-40">
        <div id="our-story">
          <OurStory />
        </div>

        <div id="data-viz">
          <DataViz />
        </div>
        <div id="our-solution">
          <OurSolution />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>

        <WhatsInItForYou />
      </div>
    </div>
  );
}
