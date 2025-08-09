"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface SimpleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  folder?: string;
  disabled?: boolean;
}

export default function SimpleImageUpload({
  value = [],
  onChange,
  maxFiles = 6,
  folder = 'buyinggood',
  disabled = false
}: SimpleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const currentImagesRef = useRef<string[]>(value);
  const originalOverflowRef = useRef<string | null>(null);

  // Keep ref in sync with prop value
  useEffect(() => {
    currentImagesRef.current = value;
  }, [value]);

  // Cleanup effect to reset body overflow on unmount
  useEffect(() => {
    return () => {
      // Reset body overflow when component unmounts
      if (typeof window !== 'undefined' && originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current;
      }
    };
  }, []);

  const handleUploadStart = () => {
    setUploading(true);
    // Store the original overflow value before Cloudinary modifies it
    if (typeof window !== 'undefined' && document.body.style.overflow !== 'hidden') {
      originalOverflowRef.current = document.body.style.overflow || '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = (result: any) => {
    if (result.event === 'success' && result.info) {
      const newUrl = result.info.secure_url;
      console.log('Adding URL:', newUrl);
      console.log('Current images before update:', currentImagesRef.current);
      
      // Check if adding this image would exceed maxFiles limit
      if (currentImagesRef.current.length >= maxFiles) {
        console.warn(`Maximum ${maxFiles} images reached. Ignoring additional upload.`);
        return;
      }
      
      // Use ref to get current state and avoid stale closure
      const updatedImages = [...currentImagesRef.current, newUrl];
      console.log('Updated images array:', updatedImages);
      
      // Update ref immediately for next callback
      currentImagesRef.current = updatedImages;
      
      // Call onChange with new array
      onChange(updatedImages);
    }
  };

  const resetBodyOverflow = () => {
    if (typeof window !== 'undefined' && originalOverflowRef.current !== null) {
      document.body.style.overflow = originalOverflowRef.current;
      originalOverflowRef.current = null;
    }
  };

  const handleQueuesEnd = () => {
    console.log('All uploads complete');
    setUploading(false);
    // Reset body overflow when all uploads are done
    setTimeout(resetBodyOverflow, 100);
  };

  const handleUploadError = () => {
    setUploading(false);
    // Reset body overflow on error
    setTimeout(resetBodyOverflow, 100);
  };

  const handleUploadClose = () => {
    setUploading(false);
    // Reset body overflow when widget closes
    setTimeout(resetBodyOverflow, 100);
  };

  const handleImageLoad = (url: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(url);
      return newSet;
    });
  };

  const handleImageLoadStart = (url: string) => {
    setLoadingImages(prev => new Set(prev).add(url));
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const canAddMore = value.length < maxFiles;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            {loadingImages.has(url) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            )}
            <Image
              src={url}
              alt={`Upload ${index + 1}`}
              fill
              className="object-cover"
              onLoadStart={() => handleImageLoadStart(url)}
              onLoad={() => handleImageLoad(url)}
              onError={() => handleImageLoad(url)}
            />
            {!disabled && (
              <Button
                onClick={() => handleRemove(index)}
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6 p-0 z-20"
                type="button"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
        
        {canAddMore && !disabled && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              folder: folder,
              multiple: true,
              maxFiles: Math.max(1, maxFiles - value.length),
              sources: ['local', 'url', 'camera'],
              clientAllowedFormats: ['image'],
              maxImageWidth: 2000,
              maxImageHeight: 2000,
              styles: {
                palette: {
                  window: "#FFFFFF",
                  windowBorder: "#90A0B3",
                  tabIcon: "#0078FF",
                  menuIcons: "#5A616A",
                  textDark: "#000000",
                  textLight: "#FFFFFF",
                  link: "#0078FF",
                  action: "#FF620C",
                  inactiveTabIcon: "#0E2F5A",
                  error: "#F44235",
                  inProgress: "#0078FF",
                  complete: "#20B832",
                  sourceBg: "#E4EBF1"
                },
                frame: {
                  background: "#FFFFFF"
                }
              }
            }}
            onOpen={handleUploadStart}
            onSuccess={handleUploadSuccess}
            onQueuesEnd={handleQueuesEnd}
            onError={handleUploadError}
            onClose={handleUploadClose}
          >
            {({ open }) => (
              <div
                onClick={() => !uploading && open()}
                className={`aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 ${
                  uploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 cursor-pointer'
                }`}
              >
                <div className="text-center">
                  {uploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Upload Photo</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {value.length}/{maxFiles} images
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </CldUploadWidget>
        )}
      </div>
      
      {value.length >= maxFiles && (
        <p className="text-sm text-gray-500">
          Maximum {maxFiles} images reached
        </p>
      )}
    </div>
  );
}