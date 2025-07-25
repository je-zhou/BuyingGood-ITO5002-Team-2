"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard/ProductCard";
import Map from "@/components/ui/map";
import { MapPin, Phone, Mail, Clock, Edit, Plus, Trash2, ArrowLeft, Eye, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ProductCreateModal from "@/components/ProductCreateModal/ProductCreateModal";
import SimpleImageUpload from "@/components/ui/simple-image-upload";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Farm {
  farmId: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact_email: string;
  contact_phone: string;
  opening_hours: string;
  ownerId: string;
  createdAt: string;
}

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

export default function FarmManagement({ params }: { params: Promise<{ userId: string; farmId: string }> }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ userId: string; farmId: string } | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [farmProduce, setFarmProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editedFarm, setEditedFarm] = useState<Farm | null>(null);
  const [farmImages, setFarmImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const fetchFarm = React.useCallback(async () => {
    if (!resolvedParams || !user) return;
    
    // Mock data - replace with real API call when backend is ready
    const mockFarm: Farm = {
      farmId: resolvedParams.farmId,
      name: "Green Valley Farm",
      description: "Organic vegetables and fruits grown with sustainable farming practices. Family-owned for over 50 years. We specialize in heirloom varieties and use only natural fertilizers and pest control methods. Our commitment to sustainable agriculture ensures that our produce is not only delicious but also environmentally responsible.",
      address: {
        street: "123 Farm Road",
        city: "Springfield",
        state: "CA",
        zipCode: "95123"
      },
      contact_email: "contact@greenvalleyfarm.com",
      contact_phone: "(555) 123-4567",
      opening_hours: "Mon-Sat 8AM-6PM, Sun 10AM-4PM",
      ownerId: resolvedParams.userId,
      createdAt: "2024-01-15T08:00:00Z"
    };

    // Mock produce data
    const mockProduce: Produce[] = [
      {
        id: "produce-001",
        name: "Organic Tomatoes",
        category: ["vegetables"],
        description: "Fresh, vine-ripened organic tomatoes. Perfect for salads, cooking, or canning.",
        pricePerUnit: 4.50,
        unit: "lb",
        minimumOrderQuantity: 5,
        minimumOrderUnit: "lbs",
        availabilityWindows: [
          { startMonth: 5, endMonth: 8 }
        ],
        farmId: resolvedParams.farmId,
        images: [],
        createdAt: "2024-04-01T09:00:00Z"
      },
      {
        id: "produce-002",
        name: "Heirloom Carrots",
        category: ["vegetables"],
        description: "Colorful heirloom carrots in purple, orange, and yellow varieties.",
        pricePerUnit: 3.75,
        unit: "lb",
        minimumOrderQuantity: 3,
        minimumOrderUnit: "lbs",
        availabilityWindows: [
          { startMonth: 7, endMonth: 11 }
        ],
        farmId: resolvedParams.farmId,
        images: [],
        createdAt: "2024-04-15T13:10:00Z"
      }
    ];

    // Mock farm images
    const mockImages = [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ];

    // Simulate API delay
    setTimeout(() => {
      setFarm(mockFarm);
      setEditedFarm(mockFarm);
      setFarmProduce(mockProduce);
      setFarmImages(mockImages);
      setLoading(false);
    }, 500);
  }, [resolvedParams, user]);

  useEffect(() => {
    if (isLoaded && user && resolvedParams) {
      fetchFarm();
    }
  }, [isLoaded, user, resolvedParams, fetchFarm]);

  const handleDeleteFarm = async () => {
    if (!farm || !resolvedParams) return;
    
    if (!confirm(`Are you sure you want to delete "${farm.name}"? This action cannot be undone and will also delete all associated products.`)) {
      return;
    }
    
    setDeleting(true);
    
    // Mock API call - replace with real API call when backend is ready
    setTimeout(() => {
      console.log(`Deleting farm ${farm.farmId}`);
      setDeleting(false);
      router.push(`/dashboard/${resolvedParams.userId}/farms`);
    }, 1000);
  };

  const handleDeleteProduce = async (produceId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    // Mock API call - replace with real API call when backend is ready
    setTimeout(() => {
      setFarmProduce(prev => prev.filter(p => p.id !== produceId));
    }, 300);
  };

  const handleProductCreated = () => {
    // Refresh the farm data to show the new product
    fetchFarm();
  };

  const handleFarmInputChange = (field: string, value: string) => {
    if (!editedFarm) return;
    
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setEditedFarm(prev => prev ? {
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      } : null);
    } else {
      setEditedFarm(prev => prev ? {
        ...prev,
        [field]: value
      } : null);
    }
  };

  const handleSaveFarm = async () => {
    if (!editedFarm || !resolvedParams) return;
    setSaving(true);
    
    // Mock API call - replace with real API call when backend is ready
    setTimeout(() => {
      setFarm(editedFarm);
      setSaving(false);
      console.log('Farm updated:', editedFarm);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading farm details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Management Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => router.push(`/dashboard/${resolvedParams.userId}/farms`)}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Farms
            </Button>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setShowProductModal(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <Button
                onClick={togglePreviewMode}
                variant="outline"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              {!isPreviewMode && (
                <Button
                  onClick={handleSaveFarm}
                  variant="outline"
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700"
                  disabled={saving}
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">Producer Profile Page</p>
          {isPreviewMode ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{farm.name}</h1>
              <div className="inline-block bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">
                {farm.address.city} {farm.address.state}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="farmName" className="text-sm font-medium text-gray-700">Farm Name</Label>
                <Input
                  id="farmName"
                  value={editedFarm?.name || ''}
                  onChange={(e) => handleFarmInputChange('name', e.target.value)}
                  className="text-3xl font-bold border-none px-0 h-auto shadow-none focus-visible:ring-0"
                  placeholder="Enter farm name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                  <Input
                    id="city"
                    value={editedFarm?.address.city || ''}
                    onChange={(e) => handleFarmInputChange('address.city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                  <Input
                    id="state"
                    value={editedFarm?.address.state || ''}
                    onChange={(e) => handleFarmInputChange('address.state', e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Photo Gallery */}
        <div className="mb-8">
          {isPreviewMode ? (
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {farmImages.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div className="aspect-square border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <img src={image} alt={`Farm photo ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-4 block">Farm Photos</Label>
              <SimpleImageUpload
                value={farmImages}
                onChange={handleImageChange}
                maxFiles={6}
                folder="farms"
                disabled={saving}
              />
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          {isPreviewMode ? (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{farm.description}</p>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Farm Description</Label>
              <Textarea
                id="description"
                value={editedFarm?.description || ''}
                onChange={(e) => handleFarmInputChange('description', e.target.value)}
                className="mt-2 min-h-32"
                placeholder="Describe your farm, what you grow, your farming practices..."
              />
            </div>
          )}
        </div>

        {/* We Produce Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">We Produce</h2>
            <Button
              onClick={() => setShowProductModal(true)}
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
                onClick={() => setShowProductModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmProduce.map((produce) => {
                const primaryCategory = produce.category[0] || 'other';
                const categoryIcon = {
                  'honey': '🍯',
                  'vegetables': '🥕',
                  'fruits': '🍎',
                  'coffeeAndTea': '☕',
                  'nutsSeeds': '🥜',
                  'eggsAndMilk': '🥛',
                  'herbs': '🌿',
                  'herbsAndSpices': '🌿',
                  'grain': '🌾',
                  'legumes': '🫘',
                  'livestock': '🐄',
                  'seafood': '🐟',
                  'forestry': '🌲',
                  'other': '🌱'
                }[primaryCategory] || '🌱';

                return (
                  <div key={produce.id} className="relative">
                    <ProductCard 
                      produce={produce} 
                      categoryIcon={categoryIcon}
                    />
                    {/* Management buttons overlay */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        onClick={() => router.push(`/dashboard/${resolvedParams.userId}/products/${produce.id}`)}
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduce(produce.id)}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
          
          {/* Contact Info and Map Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Contact Info Card */}
            <div className="border border-gray-200 rounded-lg p-6">
              {isPreviewMode ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                    <div>
                      <div className="font-medium text-blue-600 underline cursor-pointer">
                        {farm.address.street} {farm.address.state} {farm.address.zipCode}
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
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="street" className="text-sm font-medium text-gray-700">Street Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <Input
                        id="street"
                        value={editedFarm?.address.street || ''}
                        onChange={(e) => handleFarmInputChange('address.street', e.target.value)}
                        placeholder="Enter street address"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={editedFarm?.address.zipCode || ''}
                      onChange={(e) => handleFarmInputChange('address.zipCode', e.target.value)}
                      placeholder="Enter zip code"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <Input
                        id="phone"
                        value={editedFarm?.contact_phone || ''}
                        onChange={(e) => handleFarmInputChange('contact_phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <Input
                        id="email"
                        value={editedFarm?.contact_email || ''}
                        onChange={(e) => handleFarmInputChange('contact_email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="hours" className="text-sm font-medium text-gray-700">Opening Hours</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <Input
                        id="hours"
                        value={editedFarm?.opening_hours || ''}
                        onChange={(e) => handleFarmInputChange('opening_hours', e.target.value)}
                        placeholder="e.g., Mon-Sat 8AM-6PM"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Map Card */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Map</h3>
              </div>
              <div className="w-full h-48">
                <Map address={farm.address} className="w-full h-full rounded" />
              </div>
            </div>
          </div>

          {/* Management Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>{isPreviewMode ? 'Preview Mode:' : 'Edit Mode:'}</strong> {isPreviewMode ? 'This is how visitors will see your farm profile.' : 'You are currently editing your farm information. Click Preview to see how it will look to visitors.'}
            </p>
          </div>
        </div>
      </div>

      {/* Product Creation Modal */}
      <ProductCreateModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        farmId={farm.farmId}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
}