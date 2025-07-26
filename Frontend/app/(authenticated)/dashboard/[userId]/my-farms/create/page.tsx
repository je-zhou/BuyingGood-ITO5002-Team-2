"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";

interface CreateFarmData {
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
}

export default function CreateFarm({ params }: { params: Promise<{ userId: string }> }) {
  const { isLoaded } = useUser();
  const router = useRouter();
  const api = useApiClient();
  const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);
  const [formData, setFormData] = useState<CreateFarmData>({
    name: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    contact_email: "",
    contact_phone: "",
    opening_hours: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Farm name is required";
    } else if (formData.name.length < 3 || formData.name.length > 100) {
      newErrors.name = "Farm name must be between 3-100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Farm description is required";
    } else if (formData.description.length < 100 || formData.description.length > 2000) {
      newErrors.description = "Description must be between 100-2000 characters";
    }

    if (!formData.address.street.trim()) {
      newErrors['address.street'] = "Street address is required";
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = "City is required";
    }

    if (!formData.address.state.trim()) {
      newErrors['address.state'] = "State is required";
    }

    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = "Zip code is required";
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = "Contact phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!resolvedParams || !validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      const farmData = {
        ...formData,
        ownerId: resolvedParams.userId,
      };
      
      const result = await api.createFarm(farmData);
      
      if (result.success) {
        router.push(`/dashboard/${resolvedParams.userId}/my-farms`);
      } else {
        throw new Error(result.error || 'Failed to create farm');
      }
      
    } catch (error) {
      console.error('Error creating farm:', error);
      setErrors({ submit: 'Failed to create farm. Please try again.' });
      setSaving(false);
    }
  };

  if (!isLoaded || !resolvedParams) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button
            onClick={() => router.push(`/dashboard/${resolvedParams.userId}/my-farms`)}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Farms
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Farm</h1>
              <p className="text-gray-600">Add your farm to the registry</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Farm
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Farm Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className={errors.contact_email ? 'border-red-500' : ''}
                />
                {errors.contact_email && <p className="text-red-500 text-sm">{errors.contact_email}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Farm Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`mt-2 min-h-32 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your farm, what you grow, your farming practices..."
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              <p className="text-gray-500 text-sm mt-1">
                {formData.description.length}/2000 characters (minimum 100)
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Farm Address</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className={errors['address.street'] ? 'border-red-500' : ''}
                  />
                  {errors['address.street'] && <p className="text-red-500 text-sm">{errors['address.street']}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className={errors['address.city'] ? 'border-red-500' : ''}
                    />
                    {errors['address.city'] && <p className="text-red-500 text-sm">{errors['address.city']}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      className={errors['address.state'] ? 'border-red-500' : ''}
                    />
                    {errors['address.state'] && <p className="text-red-500 text-sm">{errors['address.state']}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      className={errors['address.zipCode'] ? 'border-red-500' : ''}
                    />
                    {errors['address.zipCode'] && <p className="text-red-500 text-sm">{errors['address.zipCode']}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone *</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  className={errors.contact_phone ? 'border-red-500' : ''}
                />
                {errors.contact_phone && <p className="text-red-500 text-sm">{errors.contact_phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="opening_hours">Opening Hours</Label>
                <Input
                  id="opening_hours"
                  type="text"
                  value={formData.opening_hours}
                  onChange={(e) => handleInputChange('opening_hours', e.target.value)}
                  placeholder="e.g., Mon-Sat 8AM-6PM"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}