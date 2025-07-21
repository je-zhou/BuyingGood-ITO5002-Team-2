"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Globe2, ChevronDown, ChevronUp } from "lucide-react";
import Filters from "./Filters";

interface SearchBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: () => void;
  distanceWithin?: number;
  onDistanceChange?: (distance: number) => void;
  categories?: {
    fruits: boolean;
    vegetables: boolean;
    legumes: boolean;
    nutsSeeds: boolean;
    grain: boolean;
    livestock: boolean;
    seafood: boolean;
    eggsAndMilk: boolean;
    coffeeAndTea: boolean;
    herbsAndSpices: boolean;
    forestry: boolean;
    honey: boolean;
  };
  onCategoryChange?: (category: keyof SearchBarProps['categories'], checked: boolean) => void;
  onSelectAll?: () => void;
}

export default function SearchBar({
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  onSearch: externalOnSearch,
  distanceWithin: externalDistanceWithin,
  onDistanceChange: externalOnDistanceChange,
  categories: externalCategories,
  onCategoryChange: externalOnCategoryChange,
  onSelectAll: externalOnSelectAll,
}: SearchBarProps = {}) {
  // Internal state (used when no external props provided)
  const [internalProductQuery, setInternalProductQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [internalDistanceWithin, setInternalDistanceWithin] = useState(50);
  const [internalCategories, setInternalCategories] = useState({
    fruits: true,
    vegetables: true,
    legumes: true,
    nutsSeeds: true,
    grain: true,
    livestock: true,
    seafood: true,
    eggsAndMilk: true,
    coffeeAndTea: true,
    herbsAndSpices: true,
    forestry: true,
    honey: true,
  });

  // Use external props if provided, otherwise use internal state
  const productQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalProductQuery;
  const distanceWithin = externalDistanceWithin !== undefined ? externalDistanceWithin : internalDistanceWithin;
  const categories = externalCategories || internalCategories;

  const handleCategoryChange = (
    category: keyof typeof categories,
    checked: boolean
  ) => {
    if (externalOnCategoryChange) {
      externalOnCategoryChange(category as keyof SearchBarProps['categories'], checked);
    } else {
      setInternalCategories((prev) => ({
        ...prev,
        [category]: checked,
      }));
    }
  };

  const handleSelectAll = () => {
    if (externalOnSelectAll) {
      externalOnSelectAll();
    } else {
      const allSelected = Object.values(categories).every((value) => value);
      const newValue = !allSelected;
      setInternalCategories({
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
    }
  };

  const handleSearch = () => {
    if (externalOnSearch) {
      externalOnSearch();
    } else {
      // Default behavior for landing page
      const params = new URLSearchParams();

      if (productQuery.trim()) {
        params.append("q", productQuery.trim());
      }

      if (locationQuery.trim()) {
        params.append("location", locationQuery.trim());
      }

      if (distanceWithin !== 50) {
        params.append("distance", distanceWithin.toString());
      }

      // Add selected categories
      const selectedCategories = Object.entries(categories)
        .filter(([, value]) => value)
        .map(([key]) => key);
      
      const allCategories = Object.keys(categories);
      const allSelected = selectedCategories.length === allCategories.length;
      
      // Only add categories to URL if not all are selected
      if (!allSelected && selectedCategories.length > 0) {
        params.append("categories", selectedCategories.join(','));
      }

      const searchUrl = `/search?${params.toString()}`;
      window.location.href = searchUrl;
    }
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
            onChange={(e) => {
              if (externalOnSearchChange) {
                externalOnSearchChange(e.target.value);
              } else {
                setInternalProductQuery(e.target.value);
              }
            }}
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

        <Button className="h-full" onClick={handleSearch}>
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
          onDistanceChange={externalOnDistanceChange || setInternalDistanceWithin}
          onCategoryChange={handleCategoryChange}
          onSelectAll={handleSelectAll}
        />
      </div>
    </div>
  );
}
