"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard/ProductCard";
import Map from "@/components/ui/map";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit,
  Plus,
  Trash2,
  ArrowLeft,
  Eye,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { australianStatesOptions, getSuburbsOptionsForState, getPostcodeForSuburb, type AustralianState } from "@/lib/australian-locations";
import SimpleImageUpload from "@/components/ui/simple-image-upload";
import { Farm, Produce } from "@/lib/api-types";

// Helper function to convert relative image paths to full URLs
const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath; // Already a full URL
  }
  // Local images in /public folder
  return `/${imagePath}`;
};

export default function FarmManagement({
  params,
}: {
  params: Promise<{ userId: string; farmId: string }>;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const api = useApiClient();
  const [resolvedParams, setResolvedParams] = useState<{
    userId: string;
    farmId: string;
  } | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [farmProduce, setFarmProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editedFarm, setEditedFarm] = useState<Farm | null>(null);
  const [farmImages, setFarmImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [availableSuburbsOptions, setAvailableSuburbsOptions] = useState<{value: string; label: string}[]>([]);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const fetchFarm = React.useCallback(async () => {
    if (!resolvedParams || !user) return;

    try {
      setLoading(true);

      // Fetch farm data from the API
      const farmData = await api.getFarmById(resolvedParams.farmId);
      if (farmData.success) {
        setFarm(farmData.data);
        setEditedFarm(farmData.data);
      }

      // Fetch farm produce data
      const produceData = await api.getFarmProduce(resolvedParams.farmId);
      if (produceData.success) {
        setFarmProduce(produceData.data.produce || []);
      }

      // Use real farm images from API data
      setFarmImages(farmData.data.images || []);
    } catch (error) {
      console.error("Error fetching farm data:", error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams, user, api]);

  useEffect(() => {
    if (isLoaded && user && resolvedParams) {
      fetchFarm();
    }
  }, [isLoaded, user, resolvedParams, fetchFarm]);

  // Initialize suburbs when farm data loads
  useEffect(() => {
    if (editedFarm?.address?.state) {
      const suburbsOptions = getSuburbsOptionsForState(editedFarm.address.state as AustralianState);
      setAvailableSuburbsOptions(suburbsOptions);
    }
  }, [editedFarm?.address?.state]);

  const handleDeleteFarm = async () => {
    if (!farm || !resolvedParams) return;

    if (
      !confirm(
        `Are you sure you want to delete "${farm.name}"? This action cannot be undone and will also delete all associated products.`
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      await api.deleteFarm(farm.farmId);
      router.push(`/dashboard/${resolvedParams.userId}/my-farms`);
    } catch (error) {
      console.error("Error deleting farm:", error);
      alert("Failed to delete farm. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteProduce = async (produceId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.deleteProduce(produceId);
      // Remove from local state after successful deletion
      setFarmProduce((prev) => prev.filter((p) => p.produceId !== produceId));
    } catch (error) {
      console.error("Error deleting produce:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleCreateProduct = () => {
    router.push(
      `/dashboard/${resolvedParams?.userId}/my-farms/${resolvedParams?.farmId}/products/create`
    );
  };

  const handleEditProduct = (product: Produce) => {
    router.push(
      `/dashboard/${resolvedParams?.userId}/my-farms/${resolvedParams?.farmId}/products/${product.produceId}/edit`
    );
  };

  const handleFarmInputChange = (field: string, value: string) => {
    if (!editedFarm) return;

    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      
      // Handle state change - update available suburbs
      if (addressField === 'state') {
        const suburbsOptions = getSuburbsOptionsForState(value as AustralianState);
        setAvailableSuburbsOptions(suburbsOptions);
        // Clear city and zipCode when state changes
        setEditedFarm((prev) =>
          prev
            ? {
                ...prev,
                address: {
                  ...prev.address,
                  state: value,
                  city: '',
                  zipCode: ''
                },
              }
            : null
        );
      } else if (addressField === 'city' && editedFarm.address?.state) {
        // Handle suburb/city change - auto-fill postcode
        const postcode = getPostcodeForSuburb(editedFarm.address.state as AustralianState, value);
        setEditedFarm((prev) =>
          prev
            ? {
                ...prev,
                address: {
                  ...prev.address,
                  city: value,
                  zipCode: postcode || prev.address?.zipCode || ''
                },
              }
            : null
        );
      } else {
        setEditedFarm((prev) =>
          prev
            ? {
                ...prev,
                address: {
                  ...prev.address,
                  [addressField]: value,
                },
              }
            : null
        );
      }
    } else {
      setEditedFarm((prev) =>
        prev
          ? {
              ...prev,
              [field]: value,
            }
          : null
      );
    }
  };

  const handleSaveFarm = async () => {
    if (!editedFarm || !resolvedParams) return;
    setSaving(true);

    // Mock API call - replace with real API call when backend is ready
    // In a real implementation, you would also send farmImages to the API
    setTimeout(() => {
      const updatedFarm = { ...editedFarm, images: farmImages };
      setFarm(updatedFarm);
      setSaving(false);
      console.log("Farm updated:", updatedFarm);
    }, 1000);
  };

  const handleImageChange = (urls: string[]) => {
    setFarmImages(urls);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  if (!isLoaded || loading || !farm || !resolvedParams) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading farm details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button
            onClick={() =>
              router.push(`/dashboard/${resolvedParams.userId}/my-farms`)
            }
            variant="outline"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Farms
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isPreviewMode ? "Farm Preview" : "Edit Farm"}
              </h1>
              <p className="text-gray-600">
                {isPreviewMode
                  ? "Preview how visitors see your farm"
                  : "Update your farm information"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={togglePreviewMode} variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? "Edit Mode" : "Preview"}
              </Button>
              {!isPreviewMode && (
                <Button
                  onClick={handleSaveFarm}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleDeleteFarm}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:border-red-300"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Farm
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isPreviewMode ? (
        // PREVIEW MODE - matches unauthenticated farm page layout
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {farm.name}
              </h1>
              <div className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700 flex items-center gap-2 w-fit">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p>
                  {farm.address?.street}, {farm.address?.city},{" "}
                  {farm.address?.state}
                </p>
              </div>
            </div>

            {/* Photo Gallery Carousel - using farm images first, then produce images */}
            <div className="mb-8">
              {(() => {
                // Combine farm images and produce images
                const allImages = [
                  // Farm images first
                  ...(farm.images || []).map((image, index) => ({
                    key: `farm-${index}`,
                    image,
                    alt: `${farm.name} farm`,
                    type: "farm" as const,
                  })),
                  // Then produce images
                  ...farmProduce
                    .filter(
                      (produce) => produce.images && produce.images.length > 0
                    )
                    .flatMap((produce) =>
                      produce.images!.map((image, index) => ({
                        key: `${produce.produceId}-${index}`,
                        image,
                        alt: `${produce.name} from ${farm.name}`,
                        type: "produce" as const,
                        produceName: produce.name,
                      }))
                    ),
                ].slice(0, 12);

                return allImages.length > 0 ? (
                  <Carousel className="w-full max-w-4xl mx-auto">
                    <CarouselContent>
                      {allImages.map((item) => (
                        <CarouselItem
                          key={item.key}
                          className="md:basis-1/2 lg:basis-1/3"
                        >
                          <div className="p-1">
                            <div className="aspect-square border border-gray-300 rounded-lg overflow-hidden bg-gray-50 relative">
                              <Image
                                src={getImageUrl(item.image)}
                                alt={item.alt}
                                className="object-cover"
                                fill
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No photos available for this farm.</p>
                  </div>
                );
              })()}
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {farm.description}
              </p>
            </div>

            {/* We Produce Section - NO "Add Product" button in preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                We Produce
              </h2>
              {farmProduce && farmProduce.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {farmProduce.map((produce) => {
                    const primaryCategory = produce.category?.[0] || "other";
                    const categoryIcon =
                      {
                        honey: "🍯",
                        vegetables: "🥕",
                        fruits: "🍎",
                        coffeeAndTea: "☕",
                        nutsSeeds: "🥜",
                        eggsAndMilk: "🥛",
                        herbs: "🌿",
                        herbsAndSpices: "🌿",
                        grain: "🌾",
                        legumes: "🫘",
                        livestock: "🐄",
                        seafood: "🐟",
                        forestry: "🌲",
                        other: "🌱",
                      }[primaryCategory] || "🌱";

                    return (
                      <ProductCard
                        key={produce.produceId}
                        produce={produce}
                        categoryIcon={categoryIcon}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No produce items are currently listed for this farm.</p>
                </div>
              )}
            </div>

            {/* Get in Touch Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Get in Touch
              </h2>

              {/* Contact Info and Map Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Contact Info Card */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                      <div>
                        <div className="font-medium text-blue-600 underline cursor-pointer">
                          {[
                            farm.address?.street,
                            farm.address?.city,
                            farm.address?.state,
                            farm.address?.zipCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{farm.contact_phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{farm.contact_email}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-700">
                      <Clock className="w-4 h-4 mt-1 text-gray-500" />
                      <span>{farm.opening_hours}</span>
                    </div>
                  </div>
                </div>

                {/* Map Card */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full block">
                    {farm.address &&
                      farm.address.street &&
                      farm.address.city &&
                      farm.address.state &&
                      farm.address.zipCode && (
                        <Map
                          address={
                            farm.address as {
                              street: string;
                              city: string;
                              state: string;
                              zipCode: string;
                            }
                          }
                          className="w-full h-full block"
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // EDIT MODE - original management interface
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Header */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">
                Producer Profile Page
              </p>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="farmName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Farm Name
                  </Label>
                  <Input
                    id="farmName"
                    value={editedFarm?.name || ""}
                    onChange={(e) =>
                      handleFarmInputChange("name", e.target.value)
                    }
                    className="text-3xl font-bold border-none px-0 h-auto shadow-none focus-visible:ring-0"
                    placeholder="Enter farm name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="state"
                      className="text-sm font-medium text-gray-700"
                    >
                      State
                    </Label>
                    <Combobox
                      options={australianStatesOptions}
                      value={editedFarm?.address?.state || ""}
                      onValueChange={(value) => handleFarmInputChange("address.state", value)}
                      placeholder="Select or type state"
                      searchPlaceholder="Search states..."
                      allowCustom={true}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="city"
                      className="text-sm font-medium text-gray-700"
                    >
                      Suburb/City
                    </Label>
                    <Combobox
                      options={availableSuburbsOptions}
                      value={editedFarm?.address?.city || ""}
                      onValueChange={(value) => handleFarmInputChange("address.city", value)}
                      placeholder={editedFarm?.address?.state ? "Select or type suburb/city" : "Select state first"}
                      searchPlaceholder="Search suburbs..."
                      emptyText={editedFarm?.address?.state ? "No suburbs found. Type to add custom." : "Please select a state first"}
                      allowCustom={true}
                      disabled={!editedFarm?.address?.state}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="mb-8">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Farm Photos
                </Label>
                <SimpleImageUpload
                  value={farmImages}
                  onChange={handleImageChange}
                  maxFiles={6}
                  folder="farms"
                  disabled={saving}
                />
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About
              </h2>
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Farm Description
                </Label>
                <Textarea
                  id="description"
                  value={editedFarm?.description || ""}
                  onChange={(e) =>
                    handleFarmInputChange("description", e.target.value)
                  }
                  className="mt-2 min-h-32"
                  placeholder="Describe your farm, what you grow, your farming practices..."
                />
              </div>
            </div>

            {/* We Produce Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  We Produce
                </h2>
                <Button
                  onClick={handleCreateProduct}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {farmProduce.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-gray-400 mb-4">
                    <Plus className="w-12 h-12 mx-auto mb-2" />
                    <p>No products added yet</p>
                  </div>
                  <Button
                    onClick={handleCreateProduct}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {farmProduce.map((produce) => {
                    const primaryCategory = produce.category?.[0] || "other";
                    const categoryIcon =
                      {
                        honey: "🍯",
                        vegetables: "🥕",
                        fruits: "🍎",
                        coffeeAndTea: "☕",
                        nutsSeeds: "🥜",
                        eggsAndMilk: "🥛",
                        herbs: "🌿",
                        herbsAndSpices: "🌿",
                        grain: "🌾",
                        legumes: "🫘",
                        livestock: "🐄",
                        seafood: "🐟",
                        forestry: "🌲",
                        other: "🌱",
                      }[primaryCategory] || "🌱";

                    return (
                      <div key={produce.produceId} className="relative">
                        <ProductCard
                          produce={produce}
                          categoryIcon={categoryIcon}
                        />
                        {/* Management buttons overlay */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            onClick={() => handleEditProduct(produce)}
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteProduce(produce.produceId)
                            }
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Get in Touch Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Get in Touch
              </h2>

              {/* Contact Info and Map Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Contact Info Card */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="street"
                        className="text-sm font-medium text-gray-700"
                      >
                        Street Address
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <Input
                          id="street"
                          value={editedFarm?.address?.street || ""}
                          onChange={(e) =>
                            handleFarmInputChange(
                              "address.street",
                              e.target.value
                            )
                          }
                          placeholder="Enter street address"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="zipCode"
                        className="text-sm font-medium text-gray-700"
                      >
                        Postcode
                      </Label>
                      <Input
                        id="zipCode"
                        value={editedFarm?.address?.zipCode || ""}
                        onChange={(e) =>
                          handleFarmInputChange(
                            "address.zipCode",
                            e.target.value
                          )
                        }
                        placeholder="Auto-filled when suburb selected"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <Input
                          id="phone"
                          value={editedFarm?.contact_phone || ""}
                          onChange={(e) =>
                            handleFarmInputChange(
                              "contact_phone",
                              e.target.value
                            )
                          }
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <Input
                          id="email"
                          value={editedFarm?.contact_email || ""}
                          onChange={(e) =>
                            handleFarmInputChange(
                              "contact_email",
                              e.target.value
                            )
                          }
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="hours"
                        className="text-sm font-medium text-gray-700"
                      >
                        Opening Hours
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <Input
                          id="hours"
                          value={editedFarm?.opening_hours || ""}
                          onChange={(e) =>
                            handleFarmInputChange(
                              "opening_hours",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Mon-Sat 8AM-6PM"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Card */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full block">
                    {farm.address &&
                      farm.address.street &&
                      farm.address.city &&
                      farm.address.state &&
                      farm.address.zipCode && (
                        <Map
                          address={
                            farm.address as {
                              street: string;
                              city: string;
                              state: string;
                              zipCode: string;
                            }
                          }
                          className="w-full h-full block"
                        />
                      )}
                  </div>
                </div>
              </div>

              {/* Management Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Edit Mode:</strong> You are currently editing your
                  farm information. Click Preview to see how it will look to
                  visitors.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
