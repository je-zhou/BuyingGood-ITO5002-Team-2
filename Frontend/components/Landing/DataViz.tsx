import React from "react";

export default function DataViz() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto flex flex-col items-center">
      <h1 className="text-4xl font-bold">The Problem In Numbers</h1>

      {/* Plot 1 */}
      <div className="flex flex-col items-center w-full text-gray-500 ">
        <div className="text-center space-y-2 max-w-4xl my-8">
          <p>
            In 2024 Queensland was the second largest producer of fruit and
            vegetables in Australia. The state alone produced nearly 1.6 million
            tonnes of fruits and vegetables that were transported and enjoyed
            all over the country.
          </p>
        </div>
        <div className="border mx-12 relative w-full max-w-5xl">
          <iframe
            className="h-[480px] w-full "
            src="/data_viz/plot_1_crop_production_by_tonne.html"
          />
        </div>
      </div>
      {/* Plot 1 */}
      <div className="flex flex-col items-center w-full text-gray-500 ">
        <div className="text-center space-y-2 max-w-4xl  my-8">
          <p>
            Even though Queensland remains one of Australia’s top fruit and
            vegetable producers, we are seeing a decrease in the farm gate value
            per tonne of produce sold since 2022.
          </p>
          <p>
            This is adding more strain on our regional farmers who are already
            doing it tough from paying additional freight costs to get their
            produce transported to large sorting and re-distribution centres.
          </p>
        </div>
        <div className="border mx-12 relative w-full max-w-5xl">
          <iframe
            className="h-[480px] w-full "
            src="/data_viz/plot_2_crop_production_value.html"
          />
        </div>
      </div>
      {/* Plot 1 */}
      <div className="flex flex-col gap-4 items-center w-full text-gray-500 ">
        <div className="text-center space-y-2 max-w-4xl  my-8">
          <p>
            This is a worrying trend with a large impact on regional areas. In
            the FNQ area we are seeing a slow decline in agricultural, forestry
            and fishery businesses since 2022.
          </p>
        </div>
        <div className="border mx-12 relative w-full max-w-5xl">
          <iframe
            className="h-[480px] w-full "
            src="/data_viz/plot_3_fnq_business_counts.html"
          />
        </div>
      </div>
      <p className="text-gray-500 max-w-4xl text-center  my-8">
        So how can we help address this issue that so many regional farmers are
        facing?
      </p>
    </div>
  );
}
