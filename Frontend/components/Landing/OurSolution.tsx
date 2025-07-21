import React from "react";

export default function OurSolution() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">The Solution</h1>
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
      </div>
    </div>
  );
}
