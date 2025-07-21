import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterProps {
  distanceWithin: number;
  categories: {
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
  onDistanceChange: (distance: number) => void;
  onCategoryChange: (
    category: keyof FilterProps["categories"],
    checked: boolean
  ) => void;
  onSelectAll: () => void;
}

export default function Filters({
  distanceWithin,
  categories,
  onDistanceChange,
  onCategoryChange,
  onSelectAll,
}: FilterProps) {
  const categoryData = [
    { key: "fruits", label: "Fruits" },
    { key: "vegetables", label: "Vegetables" },
    { key: "legumes", label: "Legumes" },
    { key: "nutsSeeds", label: "Nuts & Seeds" },
    { key: "grain", label: "Grain" },
    { key: "livestock", label: "Livestock" },
    { key: "seafood", label: "Seafood" },
    { key: "eggsAndMilk", label: "Eggs & Milk" },
    { key: "coffeeAndTea", label: "Coffee & Tea" },
    { key: "herbsAndSpices", label: "Herbs & Spices" },
    { key: "forestry", label: "Forestry" },
    { key: "honey", label: "Honey" },
  ];

  const isAllSelected = Object.values(categories).every((value) => value);

  return (
    <div className="w-full border-t border-gray-200 pt-4 mt-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Distance Filter */}
        <div className="flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Distance Within
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={distanceWithin}
              onChange={(e) => onDistanceChange(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
            />
            <span className="text-sm text-gray-600">KM</span>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Categories</h3>
            <button
              onClick={onSelectAll}
              className="text-sm text-primary hover:text-primary/80 cursor-pointer"
            >
              {isAllSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categoryData.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={categories[key as keyof typeof categories]}
                  onCheckedChange={(checked) =>
                    onCategoryChange(
                      key as keyof typeof categories,
                      checked === true
                    )
                  }
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
