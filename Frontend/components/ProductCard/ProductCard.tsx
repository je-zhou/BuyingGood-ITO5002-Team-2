"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Calendar, DollarSign, Package } from "lucide-react";
import { EmblaOptionsType } from "embla-carousel";
import { Produce } from "@/lib/api-types";

// Helper function to convert relative image paths to full URLs
const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath; // Already a full URL
  }
  // Local images in /public folder
  return `/${imagePath}`;
};

interface ProductCardProps {
  produce: Produce;
  categoryIcon: string;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ProductCard: React.FC<ProductCardProps> = ({ produce, categoryIcon }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const formatAvailability = () => {
    if (!produce.availabilityWindows || produce.availabilityWindows.length === 0) return "Not available";

    return produce.availabilityWindows
      .map((window) => {
        const startMonth = Math.max(0, Math.min(11, window.startMonth));
        const endMonth = Math.max(0, Math.min(11, window.endMonth));
        
        if (startMonth === endMonth) {
          return `${monthNames[startMonth]}`;
        } else if (startMonth <= endMonth) {
          return `${monthNames[startMonth]} - ${monthNames[endMonth]}`;
        } else {
          return `${monthNames[startMonth]} - ${monthNames[endMonth]} (cross-year)`;
        }
      })
      .join(", ");
  };

  const carouselOptions: EmblaOptionsType = {
    loop: true,
    align: "start",
  };

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  // Create image slides for all product images
  const imageSlides = produce.images && produce.images.length > 0 ? 
    produce.images.map((image, index) => ({
      id: `image-${index}`,
      content: (
        <div
          className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src={getImageUrl(image)} 
            alt={`${produce.name} - Image ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center"><span class="text-gray-500 text-sm">${produce.name}</span></div>`;
              }
            }}
          />

          {/* Semi-transparent overlay with product name and icon */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 ${
              isHovering
                ? "bg-opacity-0 opacity-0"
                : "bg-opacity-20 opacity-100"
            }`}
          >
            <div className="text-3xl mb-2">{categoryIcon}</div>
            <h3 className="text-lg font-semibold text-center">
              {produce.name}
            </h3>
          </div>

          {/* Image counter for multiple images */}
          {produce.images && produce.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {index + 1}/{produce.images.length}
            </div>
          )}
        </div>
      ),
    })) : 
    [{
      id: "no-image",
      content: (
        <div
          className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Product Image</span>
          </div>

          {/* Semi-transparent overlay with product name and icon */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 ${
              isHovering
                ? "bg-opacity-0 opacity-0"
                : "bg-opacity-20 opacity-100"
            }`}
          >
            <div className="text-3xl mb-2">{categoryIcon}</div>
            <h3 className="text-lg font-semibold text-center">
              {produce.name}
            </h3>
          </div>
        </div>
      ),
    }];

  const slides = [
    ...imageSlides,
    {
      id: "availability",
      content: (
        <div className="aspect-square bg-gray-50 p-4 flex flex-col justify-center">
          <div className="text-center">
            <Calendar className="w-8 h-8 mx-auto mb-4 text-green-600" />
            <h4 className="font-semibold text-gray-900 mb-3">Availability</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {formatAvailability()}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "pricing",
      content: (
        <div className="aspect-square bg-gray-50 p-4 flex flex-col justify-center">
          <div className="text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-4 text-green-600" />
            <h4 className="font-semibold text-gray-900 mb-3">Price</h4>
            {produce.pricePerUnit && produce.unit ? (
              <>
                <div className="text-lg font-bold text-green-600 mb-2">
                  ${produce.pricePerUnit.toFixed(2)} / {produce.unit}
                </div>
                <p className="text-xs text-gray-500">per {produce.unit}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Price not available</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "order",
      content: (
        <div className="aspect-square bg-gray-50 p-4 flex flex-col justify-center">
          <div className="text-center">
            <Package className="w-8 h-8 mx-auto mb-4 text-green-600" />
            <h4 className="font-semibold text-gray-900 mb-3">Min Order</h4>
            {produce.minimumOrderQuantity && produce.minimumOrderUnit ? (
              <>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {produce.minimumOrderQuantity} {produce.minimumOrderUnit}
                </div>
                <p className="text-xs text-gray-500">minimum order</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No minimum order</p>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm relative">
      <Carousel opts={carouselOptions} className="w-full" setApi={setApi}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>{slide.content}</CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel indicators inside the card */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                currentSlide === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default ProductCard;
