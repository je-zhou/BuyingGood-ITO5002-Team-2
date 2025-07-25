'use client';

import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Calendar, DollarSign, Package } from 'lucide-react';
import { EmblaOptionsType } from 'embla-carousel';

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
  images: string[];
  createdAt: string;
}

interface ProductCardProps {
  produce: Produce;
  categoryIcon: string;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ProductCard: React.FC<ProductCardProps> = ({ produce, categoryIcon }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const formatAvailability = () => {
    if (produce.availabilityWindows.length === 0) return 'Not available';
    
    return produce.availabilityWindows.map(window => {
      if (window.startMonth === window.endMonth) {
        return `${monthNames[window.startMonth]}`;
      } else if (window.startMonth <= window.endMonth) {
        return `${monthNames[window.startMonth]} - ${monthNames[window.endMonth]}`;
      } else {
        return `${monthNames[window.startMonth]} - ${monthNames[window.endMonth]} (cross-year)`;
      }
    }).join(', ');
  };

  const carouselOptions: EmblaOptionsType = {
    loop: true,
    align: 'start'
  };

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const slides = [
    {
      id: 'image',
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
          <div className={`absolute inset-0 bg-black transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 ${
            isHovering ? 'bg-opacity-0 opacity-0' : 'bg-opacity-20 opacity-100'
          }`}>
            <div className="text-3xl mb-2">{categoryIcon}</div>
            <h3 className="text-lg font-semibold text-center">{produce.name}</h3>
          </div>
        </div>
      )
    },
    {
      id: 'availability',
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
      )
    },
    {
      id: 'pricing',
      content: (
        <div className="aspect-square bg-gray-50 p-4 flex flex-col justify-center">
          <div className="text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-4 text-green-600" />
            <h4 className="font-semibold text-gray-900 mb-3">Price</h4>
            <div className="text-lg font-bold text-green-600 mb-2">
              ${produce.pricePerUnit.toFixed(2)} / {produce.unit}
            </div>
            <p className="text-xs text-gray-500">per {produce.unit}</p>
          </div>
        </div>
      )
    },
    {
      id: 'order',
      content: (
        <div className="aspect-square bg-gray-50 p-4 flex flex-col justify-center">
          <div className="text-center">
            <Package className="w-8 h-8 mx-auto mb-4 text-green-600" />
            <h4 className="font-semibold text-gray-900 mb-3">Min Order</h4>
            <div className="text-lg font-bold text-gray-900 mb-1">
              {produce.minimumOrderQuantity} {produce.minimumOrderUnit}
            </div>
            <p className="text-xs text-gray-500">minimum order</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm relative">
      <Carousel 
        opts={carouselOptions}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              {slide.content}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Carousel indicators inside the card */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
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