"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Globe2, ChevronDown, ChevronUp } from "lucide-react";
import Filters from "./Filters";

export default function SearchBar() {
  const [productQuery, setProductQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [distanceWithin, setDistanceWithin] = useState(50);
  const [categories, setCategories] = useState({
    fruits: false,
    vegetables: false,
    legumes: false,
    nutsSeeds: false,
    grain: false,
    livestock: false,
    seafood: false,
    eggsAndMilk: false,
    coffeeAndTea: false,
    herbsAndSpices: false,
    forestry: false,
    honey: false,
  });

  const handleCategoryChange = (
    category: keyof typeof categories,
    checked: boolean
  ) => {
    setCategories((prev) => ({
      ...prev,
      [category]: checked,
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(categories).every((value) => value);
    const newValue = !allSelected;
    setCategories({
      fruits: newValue,
      vegetables: newValue,
      legumes: newValue,
      nutsSeeds: newValue,
      grain: newValue,
      livestock: newValue,
      seafood: newValue,
      eggsAndMilk: newValue,
      coffeeAndTea: newValue,
      herbsAndSpices: newValue,
      forestry: newValue,
      honey: newValue,
    });
  };

  const handleFindFarmers = () => {
    const params = new URLSearchParams();

    if (productQuery.trim()) {
      params.append("product", productQuery.trim());
    }

    if (locationQuery.trim()) {
      params.append("location", locationQuery.trim());
    }

    params.append("distance", distanceWithin.toString());

    // Add selected categories
    Object.entries(categories).forEach(([key, value]) => {
      if (value) {
        params.append("categories", key);
      }
    });

    const searchUrl = `/search?${params.toString()}`;
    console.log("Search URL:", searchUrl); // For debugging

    // Navigate to search results page
    // window.location.href = searchUrl; // Uncomment when ready to navigate
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 w-full h-full">
        <div className="flex items-center w-full">
          <Input
            placeholder="I want to buy..."
            className="rounded-l-sm rounded-r-none h-12"
            type="text"
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
          />
          <label className="relative">
            <Globe2 className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 stroke-1" />
            <Input
              type="text"
              placeholder="Cairns, QLD..."
              className="border-l-0 rounded-l-none rounded-r-sm pl-10 h-12"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </label>
        </div>

        <Button className="h-full" onClick={handleFindFarmers}>
          Find Local Farmers
        </Button>
      </div>

      <div className="mt-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors duration-200"
        >
          {showFilters ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          Filter by
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Filters
          distanceWithin={distanceWithin}
          categories={categories}
          onDistanceChange={setDistanceWithin}
          onCategoryChange={handleCategoryChange}
          onSelectAll={handleSelectAll}
        />
      </div>
    </div>
  );
}
