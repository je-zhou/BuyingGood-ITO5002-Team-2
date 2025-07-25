import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

export default function WhatsInItForYou() {
  return (
    <div className="grid grid-cols-3 justify-center items-center p-8 border rounded-lg m-12 max-w-7xl mx-auto">
      {/* Copy */}
      <div className="col-span-2 flex flex-col p-4 pr-16">
        <h2 className="text-2xl font-bold">What&apos;s in it for you?</h2>
        <div className="flex flex-col gap-2 pt-4">
          <p className="text-gray-500">
            You are the key to unlocking sustainable production and consumption
            patterns. By registering your farm and providing information about
            your seasonal produce, you will shine a spotlight on the fruits of
            your labour, and open doors for new partnership and business
            opportunities.
          </p>
          <p className="text-gray-500">
            Together, we will begin to challenge the unsustainable patterns of
            delivering produce from farm to table.
          </p>
        </div>

        {/* CTA Buttons*/}
        <div className="flex gap-2 pt-4">
          <Button>Register your farm</Button>
          <Button variant={"outline"}>Learn more</Button>
        </div>
      </div>

      {/* Image */}

      <div className="relative h-full w-full">
        <Image
          src={"/farmer 2.png"}
          // src={""}
          alt="img"
          fill
          objectFit="cover"
          className="border h-full w-full rounded"
        ></Image>
      </div>
    </div>
  );
}
