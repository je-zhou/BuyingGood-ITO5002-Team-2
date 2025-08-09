"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Globe2, ChevronDown, ChevronUp } from "lucide-react";
import Filters from "./Filters";

interface SearchBarProps {
  searchQuery?: string;
  locationQuery?: string;
  onSearchChange?: (query: string) => void;
  onLocationChange?: (location: string) => void;
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
  onCategoryChange?: (
    category: keyof SearchBarProps["categories"],
    checked: boolean
  ) => void;
  onSelectAll?: () => void;
}

export default function SearchBar({
  searchQuery: externalSearchQuery,
  locationQuery: externalLocationQuery,
  onSearchChange: externalOnSearchChange,
  onLocationChange: externalOnLocationChange,
  onSearch: externalOnSearch,
  distanceWithin: externalDistanceWithin,
  onDistanceChange: externalOnDistanceChange,
  categories: externalCategories,
  onCategoryChange: externalOnCategoryChange,
  onSelectAll: externalOnSelectAll,
}: SearchBarProps = {}) {
  // Internal state (used when no external props provided)
  const [internalProductQuery, setInternalProductQuery] = useState("");
  const [internalLocationQuery, setInternalLocationQuery] = useState("");
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
  const productQuery =
    externalSearchQuery !== undefined
      ? externalSearchQuery
      : internalProductQuery;
  const locationQuery =
    externalLocationQuery !== undefined
      ? externalLocationQuery
      : internalLocationQuery;
  const distanceWithin =
    externalDistanceWithin !== undefined
      ? externalDistanceWithin
      : internalDistanceWithin;
  const categories = externalCategories || internalCategories;

  const handleCategoryChange = (
    category: keyof typeof categories,
    checked: boolean
  ) => {
    if (externalOnCategoryChange) {
      externalOnCategoryChange(
        category as keyof SearchBarProps["categories"],
        checked
      );
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
        params.append("categories", selectedCategories.join(","));
      }

      const searchUrl = `/farms?${params.toString()}`;
      window.location.href = searchUrl;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full h-full">
        <div className="flex flex-col md:flex-row items-center w-full h-full gap-2 md:gap-0">
          <Input
            placeholder="I want to buy..."
            className="rounded-sm md:rounded-l-sm md:rounded-r-none h-10 md:h-12 w-full"
            type="text"
            value={productQuery}
            onChange={(e) => {
              if (externalOnSearchChange) {
                externalOnSearchChange(e.target.value);
              } else {
                setInternalProductQuery(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
          />
          <label className="relative w-fit">
            <Globe2 className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 stroke-1" />
            <Input
              type="text"
              placeholder="Cairns, QLD..."
              className="md:border-l-0 rounded-sm md:rounded-l-none md:rounded-r-sm pl-10 h-10 md:h-12 w-full"
              value={locationQuery}
              onChange={(e) => {
                if (externalOnLocationChange) {
                  externalOnLocationChange(e.target.value);
                } else {
                  setInternalLocationQuery(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
            />
          </label>
        </div>

        <Button
          className="h-10 md:h-12 cursor-pointer w-full md:w-auto px-3 md:px-4 text-sm md:text-base"
          onClick={handleSearch}
        >
          <span className="hidden md:inline">Find Local Farmers</span>
          <span className="md:hidden">Search</span>
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
          onDistanceChange={
            externalOnDistanceChange || setInternalDistanceWithin
          }
          onCategoryChange={handleCategoryChange}
          onSelectAll={handleSelectAll}
        />
      </div>
    </div>
  );
}
