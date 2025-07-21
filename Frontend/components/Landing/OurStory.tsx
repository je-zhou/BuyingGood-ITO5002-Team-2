import React from "react";

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
      </div>
    </div>
  );
}
