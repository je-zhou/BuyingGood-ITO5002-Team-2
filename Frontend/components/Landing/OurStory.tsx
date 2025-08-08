import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OurStory() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Our Story</h1>
        <div className="text-gray-500 max-w-4xl text-center space-y-2">
          <p>
            Too often, fresh produce travel thousands of kilometers reach
            distribution centres, only to return to supermarket shelves right
            next to the farm.
          </p>
          <p>
            By then, fresh produce isn’t so fresh, and the freight costs are
            inevitably absorbed by buyers.
          </p>
          <p>
            BuyingGood is about challenging this status quo, raising awareness
            and supporting sustainable production and consumption patterns of
            fresh produce.
          </p>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Link href="/farms">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
              Explore Local Farms
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2">
              Learn More About Us
            </Button>
          </Link>
        </div>
      </div>

      <Image
        src={"/farmer.png"}
        alt="logo"
        width={480}
        height={400}
        className="rounded-lg border my-6"
      />
    </div>
  );
}
