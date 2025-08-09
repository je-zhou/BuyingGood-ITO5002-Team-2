"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import SimpleImageUpload from "@/components/ui/simple-image-upload";

interface Produce {
  id: string;
  name: string;
  category: string[];
  description: string;
  pricePerUnit: number;
  unit: string;
  minimumOrderQuantity: number;
  minimumOrderUnit: string;
  availabilityWindows: {
    startMonth: number;
    endMonth: number;
  }[];
  farmId: string;
  images: string[];
  createdAt: string;
}

interface AvailabilityWindow {
  id: string;
  startMonth: number;
  endMonth: number;
}

interface EditProductData {
  name: string;
  category: string[];
  description: string;
  pricePerUnit: number;
  unit: string;
  minimumOrderQuantity: number;
  minimumOrderUnit: string;
  availabilityWindows: AvailabilityWindow[];
  images: string[];
}

const categories = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "herbs", label: "Herbs" },
  { value: "herbsAndSpices", label: "Herbs & Spices" },
  { value: "grain", label: "Grain" },
  { value: "legumes", label: "Legumes" },
  { value: "nutsSeeds", label: "Nuts & Seeds" },
  { value: "eggsAndMilk", label: "Eggs & Milk" },
  { value: "honey", label: "Honey" },
  { value: "coffeeAndTea", label: "Coffee & Tea" },
  { value: "livestock", label: "Livestock" },
  { value: "seafood", label: "Seafood" },
  { value: "forestry", label: "Forestry" },
  { value: "other", label: "Other" },
];

const units = [
  { value: "lb", label: "Pound (lb)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "oz", label: "Ounce (oz)" },
  { value: "g", label: "Gram (g)" },
  { value: "each", label: "Each" },
  { value: "dozen", label: "Dozen" },
  { value: "bushel", label: "Bushel" },
  { value: "crate", label: "Crate" },
  { value: "bag", label: "Bag" },
  { value: "box", label: "Box" },
];

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function EditProductPage({
  params,
}: {
  params: Promise<{ userId: string; farmId: string; productId: string }>;
}) {
  const router = useRouter();
  const api = useApiClient();
  const [resolvedParams, setResolvedParams] = useState<{
    userId: string;
    farmId: string;
    productId: string;
  } | null>(null);
  const [product, setProduct] = useState<Produce | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<EditProductData>({
    name: "",
    category: [],
    description: "",
    pricePerUnit: 0,
    unit: "",
    minimumOrderQuantity: 1,
    minimumOrderUnit: "",
    availabilityWindows: [
      { id: crypto.randomUUID(), startMonth: 1, endMonth: 12 },
    ],
    images: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const fetchProduct = React.useCallback(async () => {
    if (!resolvedParams) return;

    try {
      const data = await api.getProduceById(resolvedParams.productId);

      if (data.success) {
        const product = data.data;
        setProduct(product);
        setFormData({
          name: product.name,
          category: product.category,
          description: product.description,
          pricePerUnit: product.pricePerUnit,
          unit: product.unit,
          minimumOrderQuantity: product.minimumOrderQuantity,
          minimumOrderUnit: product.minimumOrderUnit,
          availabilityWindows: product.availabilityWindows.map(
            (window: { startMonth: number; endMonth: number }) => ({
              id: crypto.randomUUID(),
              startMonth: window.startMonth,
              endMonth: window.endMonth,
            })
          ),
          images: product.images,
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams, api]);

  useEffect(() => {
    if (resolvedParams) {
      fetchProduct();
    }
  }, [resolvedParams, fetchProduct]);

  const handleInputChange = (
    field: string,
    value: string | number | string[] | AvailabilityWindow[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleCategoryChange = (categoryValue: string) => {
    setFormData((prev) => {
      const currentCategories = prev.category;
      if (currentCategories.includes(categoryValue)) {
        // Remove category if already selected
        return {
          ...prev,
          category: currentCategories.filter((cat) => cat !== categoryValue),
        };
      } else {
        // Add category if not selected
        return {
          ...prev,
          category: [...currentCategories, categoryValue],
        };
      }
    });

    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const addAvailabilityWindow = () => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: [
        ...prev.availabilityWindows,
        { id: crypto.randomUUID(), startMonth: 1, endMonth: 12 },
      ],
    }));
  };

  const removeAvailabilityWindow = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: prev.availabilityWindows.filter(
        (window) => window.id !== id
      ),
    }));
  };

  const updateAvailabilityWindow = (
    id: string,
    field: "startMonth" | "endMonth",
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: prev.availabilityWindows.map((window) =>
        window.id === id ? { ...window, [field]: value } : window
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = "Product name must be between 2-100 characters";
    }

    if (formData.category.length === 0) {
      newErrors.category = "At least one category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (
      formData.description.length < 50 ||
      formData.description.length > 1000
    ) {
      newErrors.description = "Description must be between 50-1000 characters";
    }

    if (!formData.unit) {
      newErrors.unit = "Unit is required";
    }

    if (!formData.minimumOrderUnit) {
      newErrors.minimumOrderUnit = "Minimum order unit is required";
    }

    if (formData.pricePerUnit < 0) {
      newErrors.pricePerUnit = "Price cannot be negative";
    }

    if (formData.minimumOrderQuantity <= 0) {
      newErrors.minimumOrderQuantity =
        "Minimum order quantity must be greater than 0";
    }

    // Validate availability windows
    if (formData.availabilityWindows.length === 0) {
      newErrors.availabilityWindows =
        "At least one availability window is required";
    } else {
      for (const window of formData.availabilityWindows) {
        if (window.startMonth > window.endMonth) {
          newErrors.availabilityWindows =
            "Start month cannot be after end month in any availability window";
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !resolvedParams || !product) {
      return;
    }

    setSaving(true);

    try {
      const result = await api.updateProduce(
        resolvedParams.productId,
        formData
      );

      if (result.success) {
        router.push(
          `/dashboard/${resolvedParams.userId}/my-farms/${resolvedParams.farmId}`
        );
      } else {
        throw new Error(result.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors({ submit: "Failed to update product. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (resolvedParams) {
      router.push(
        `/dashboard/${resolvedParams.userId}/my-farms/${resolvedParams.farmId}`
      );
    }
  };

  if (!resolvedParams || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Farm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={handleBack} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Farm
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                placeholder="e.g., Organic Tomatoes"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Categories * (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 border rounded-lg">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={category.value}
                      checked={formData.category.includes(category.value)}
                      onCheckedChange={() =>
                        handleCategoryChange(category.value)
                      }
                    />
                    <Label
                      htmlFor={category.value}
                      className="text-sm cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.category.map((categoryValue) => {
                    const categoryLabel = categories.find(
                      (cat) => cat.value === categoryValue
                    )?.label;
                    return (
                      <span
                        key={categoryValue}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                      >
                        {categoryLabel}
                        <button
                          type="button"
                          onClick={() => handleCategoryChange(categoryValue)}
                          className="ml-1 hover:text-green-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`min-h-24 ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Describe your product, how it's grown, what makes it special..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <p className="text-gray-500 text-sm">
                {formData.description.length}/1000 characters (minimum 50)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit *</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerUnit || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "pricePerUnit",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={errors.pricePerUnit ? "border-red-500" : ""}
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-500">
                  Set to $0.00 if you want this product to appear as
                  &quot;Available on Request&quot; to consumers
                </p>
                {errors.pricePerUnit && (
                  <p className="text-red-500 text-sm">{errors.pricePerUnit}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleInputChange("unit", value)}
                >
                  <SelectTrigger
                    className={errors.unit ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-red-500 text-sm">{errors.unit}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumOrderQuantity">
                  Minimum Order Quantity *
                </Label>
                <Input
                  id="minimumOrderQuantity"
                  type="number"
                  min="1"
                  value={formData.minimumOrderQuantity || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "minimumOrderQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className={
                    errors.minimumOrderQuantity ? "border-red-500" : ""
                  }
                  placeholder="1"
                />
                {errors.minimumOrderQuantity && (
                  <p className="text-red-500 text-sm">
                    {errors.minimumOrderQuantity}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumOrderUnit">Minimum Order Unit *</Label>
                <Select
                  value={formData.minimumOrderUnit}
                  onValueChange={(value) =>
                    handleInputChange("minimumOrderUnit", value)
                  }
                >
                  <SelectTrigger
                    className={errors.minimumOrderUnit ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.minimumOrderUnit && (
                  <p className="text-red-500 text-sm">
                    {errors.minimumOrderUnit}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <SimpleImageUpload
                value={formData.images}
                onChange={(images) => handleInputChange("images", images)}
                maxFiles={6}
                folder="products"
                disabled={saving}
              />
              <p className="text-sm text-gray-500">
                Upload images of your product to help buyers see what
                they&apos;re purchasing.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Availability Windows *</Label>
                <Button
                  type="button"
                  onClick={addAvailabilityWindow}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Window
                </Button>
              </div>

              <div className="space-y-3">
                {formData.availabilityWindows.map((window, index) => (
                  <div
                    key={window.id}
                    className="p-4 border rounded-lg bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Availability Window {index + 1}
                      </h4>
                      {formData.availabilityWindows.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeAvailabilityWindow(window.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Month</Label>
                        <Select
                          value={window.startMonth.toString()}
                          onValueChange={(value) =>
                            updateAvailabilityWindow(
                              window.id,
                              "startMonth",
                              parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select start month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem
                                key={month.value}
                                value={month.value.toString()}
                              >
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>End Month</Label>
                        <Select
                          value={window.endMonth.toString()}
                          onValueChange={(value) =>
                            updateAvailabilityWindow(
                              window.id,
                              "endMonth",
                              parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select end month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem
                                key={month.value}
                                value={month.value.toString()}
                              >
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.availabilityWindows && (
                <p className="text-red-500 text-sm">
                  {errors.availabilityWindows}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
