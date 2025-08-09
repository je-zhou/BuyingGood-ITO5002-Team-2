import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OurSolution() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">The Solution</h1>

        <div className="flex items-center gap-4 pt-8">
          <ul className="text-gray-500 max-w-4xl space-y-2 list-disc list-inside">
            <li>
              Raise awareness of the unsustainable practices of existing
              supply-chains
            </li>
            <li>
              Reduce logistical overhead of the farmer to grocer relationship
            </li>
            <li>Increase the demand for local produce</li>
            <li>
              And empower people with information about what is grown in their
              communities
            </li>
          </ul>
          <Image
            src={"/veggies.png"}
            alt="logo"
            width={480}
            height={400}
            className="rounded-lg border my-6"
          />
        </div>
        
        <div className="flex gap-4 mt-8">
          <Link href="/contact">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
              Get in Touch
            </Button>
          </Link>
          <Link href="/farms">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2">
              Find Local Produce
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
