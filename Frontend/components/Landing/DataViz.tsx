import React from "react";

export default function DataViz() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col items-center">
      <h1 className="text-4xl font-bold">The Problem In Numbers</h1>

      {/* Plot 1 */}
      <div className="flex flex-col gap-4 items-center m-8 mb-20 w-full">
        <div className="border mx-12 p-4 relative w-full h-[640px]">
          <iframe
            className="h-full w-full"
            src="/data_viz/interactive_business_count.html"
          />
        </div>
        <div className="text-center mt-4 max-w-5xl">
          <h3 className="font-semibold">Plot 1 Title</h3>
          <p>Plot 1 Description</p>
        </div>
      </div>
      {/* Plot 1 */}
      <div className="flex flex-col gap-4 items-center m-8 mb-20 w-full">
        <div className="border mx-12 p-4 relative w-full h-[640px]">
          <iframe
            className="h-full w-full"
            src="/data_viz/interactive_business_count.html"
          />
        </div>
        <div className="text-center mt-4 max-w-5xl">
          <h3 className="font-semibold">Plot 1 Title</h3>
          <p>Plot 1 Description</p>
        </div>
      </div>
      {/* Plot 1 */}
      <div className="flex flex-col gap-4 items-center m-8 mb-20 w-full">
        <div className="border mx-12 p-4 relative w-full h-[640px]">
          <iframe
            className="h-full w-full"
            src="/data_viz/interactive_business_count.html"
          />
        </div>
        <div className="text-center mt-4 max-w-5xl">
          <h3 className="font-semibold">Plot 1 Title</h3>
          <p>Plot 1 Description</p>
        </div>
      </div>
    </div>
  );
}
