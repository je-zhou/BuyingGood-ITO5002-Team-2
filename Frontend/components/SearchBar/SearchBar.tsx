import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Globe2 } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex items-center gap-4 w-full h-full">
      <div className="flex items-center w-full">
        <Input
          placeholder="I want to buy..."
          className="rounded-l-sm rounded-r-none h-12"
          type="text"
        />
        <label className="relative">
          <Globe2 className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 stroke-1" />
          <Input
            type="text"
            placeholder="Cairns, QLD..."
            className="border-l-0 rounded-l-none rounded-r-sm pl-10 h-12"
          />
        </label>
      </div>

      <Button className="h-full">Find Local Farmers</Button>
    </div>
  );
}
