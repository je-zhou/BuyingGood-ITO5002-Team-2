"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Save } from "lucide-react";
import SimpleImageUpload from "@/components/ui/simple-image-upload";
import { Produce } from "@/lib/api-types";

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmId: string;
  onProductCreated: () => void;
  editingProduct?: Produce | null;
}

interface CreateProductData {
  name: string;
  category: string[];
  description: string;
  pricePerUnit: number;
  unit: string;
  minimumOrderQuantity: number;
  minimumOrderUnit: string;
  availabilityStartMonth: number;
  availabilityEndMonth: number;
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
  { value: "other", label: "Other" }
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
  { value: "box", label: "Box" }
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
  { value: 12, label: "December" }
];

export default function ProductCreateModal({
  isOpen,
  onClose,
  farmId,
  onProductCreated,
  editingProduct = null
}: ProductCreateModalProps) {
  const router = useRouter();
  const isEditing = !!editingProduct;
  
  const getInitialFormData = React.useCallback((): CreateProductData => {
    if (editingProduct) {
      return {
        name: editingProduct.name,
        category: editingProduct.category || [],
        description: editingProduct.description || "",
        pricePerUnit: editingProduct.pricePerUnit || 0,
        unit: editingProduct.unit || "",
        minimumOrderQuantity: editingProduct.minimumOrderQuantity || 1,
        minimumOrderUnit: editingProduct.minimumOrderUnit || "",
        availabilityStartMonth: editingProduct.availabilityWindows?.[0]?.startMonth || 1,
        availabilityEndMonth: editingProduct.availabilityWindows?.[0]?.endMonth || 12,
        images: editingProduct.images || []
      };
    }
    return {
      name: "",
      category: [],
      description: "",
      pricePerUnit: 0,
      unit: "",
      minimumOrderQuantity: 1,
      minimumOrderUnit: "",
      availabilityStartMonth: 1,
      availabilityEndMonth: 12,
      images: []
    };
  }, [editingProduct]);

  const [formData, setFormData] = useState<CreateProductData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Update form data when editingProduct changes
  React.useEffect(() => {
    setFormData(getInitialFormData());
    setErrors({});
  }, [editingProduct, isOpen, getInitialFormData]);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = "Product name must be between 2-100 characters";
    }

    if (formData.category.length === 0) {
      newErrors.category = "At least one category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (formData.description.length < 50 || formData.description.length > 1000) {
      newErrors.description = "Description must be between 50-1000 characters";
    }

    if (!formData.unit) {
      newErrors.unit = "Unit is required";
    }

    if (!formData.minimumOrderUnit) {
      newErrors.minimumOrderUnit = "Minimum order unit is required";
    }

    if (formData.pricePerUnit <= 0) {
      newErrors.pricePerUnit = "Price must be greater than 0";
    }

    if (formData.minimumOrderQuantity <= 0) {
      newErrors.minimumOrderQuantity = "Minimum order quantity must be greater than 0";
    }

    if (formData.availabilityStartMonth > formData.availabilityEndMonth) {
      newErrors.availabilityStartMonth = "Start month cannot be after end month";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      if (isEditing) {
        // Mock API call for updating product - replace with real API call when backend is ready
        const updatedProduct = {
          ...editingProduct,
          ...formData,
          availabilityWindows: [{
            startMonth: formData.availabilityStartMonth,
            endMonth: formData.availabilityEndMonth
          }],
          images: formData.images
        };
        
        console.log('Updating product:', updatedProduct);
        
        // Simulate API delay
        setTimeout(() => {
          setSaving(false);
          onClose();
          onProductCreated();
          router.refresh();
        }, 1000);
      } else {
        // Mock API call for creating product - replace with real API call when backend is ready
        const newProduct = {
          id: `produce-${Date.now()}`,
          ...formData,
          availabilityWindows: [{
            startMonth: formData.availabilityStartMonth,
            endMonth: formData.availabilityEndMonth
          }],
          farmId,
          images: formData.images,
          createdAt: new Date().toISOString()
        };
        
        console.log('Creating product:', newProduct);
        
        // Simulate API delay
        setTimeout(() => {
          setSaving(false);
          onClose();
          onProductCreated();
          router.refresh();
        }, 1000);
      }
      
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, error);
      setErrors({ submit: `Failed to ${isEditing ? 'update' : 'create'} product. Please try again.` });
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData(getInitialFormData());
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="e.g., Organic Tomatoes"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category[0] || ''} onValueChange={(value) => handleInputChange('category', [value])}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`min-h-24 ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe your product, how it's grown, what makes it special..."
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
                value={formData.pricePerUnit || ''}
                onChange={(e) => handleInputChange('pricePerUnit', parseFloat(e.target.value) || 0)}
                className={errors.pricePerUnit ? 'border-red-500' : ''}
                placeholder="0.00"
              />
              {errors.pricePerUnit && <p className="text-red-500 text-sm">{errors.pricePerUnit}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
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
              {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity *</Label>
              <Input
                id="minimumOrderQuantity"
                type="number"
                min="1"
                value={formData.minimumOrderQuantity || ''}
                onChange={(e) => handleInputChange('minimumOrderQuantity', parseInt(e.target.value) || 1)}
                className={errors.minimumOrderQuantity ? 'border-red-500' : ''}
                placeholder="1"
              />
              {errors.minimumOrderQuantity && <p className="text-red-500 text-sm">{errors.minimumOrderQuantity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumOrderUnit">Minimum Order Unit *</Label>
              <Select value={formData.minimumOrderUnit} onValueChange={(value) => handleInputChange('minimumOrderUnit', value)}>
                <SelectTrigger className={errors.minimumOrderUnit ? 'border-red-500' : ''}>
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
              {errors.minimumOrderUnit && <p className="text-red-500 text-sm">{errors.minimumOrderUnit}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <SimpleImageUpload
              value={formData.images}
              onChange={(images) => handleInputChange('images', images)}
              maxFiles={5}
              folder="products" 
              disabled={saving}
            />
            <p className="text-sm text-gray-500">
              Upload images of your product to help buyers see what they&apos;re purchasing.
            </p>
          </div>

          <div className="space-y-4">
            <Label>Availability Window</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availabilityStartMonth">Start Month</Label>
                <Select value={formData.availabilityStartMonth.toString()} onValueChange={(value) => handleInputChange('availabilityStartMonth', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select start month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availabilityEndMonth">End Month</Label>
                <Select value={formData.availabilityEndMonth.toString()} onValueChange={(value) => handleInputChange('availabilityEndMonth', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select end month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {errors.availabilityStartMonth && <p className="text-red-500 text-sm">{errors.availabilityStartMonth}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleClose}
            variant="outline"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Product' : 'Create Product'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}