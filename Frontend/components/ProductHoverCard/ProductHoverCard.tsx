import React from 'react';
import { Produce } from '@/lib/api-types';

interface ProductHoverCardProps {
  produce: Produce;
  className?: string;
}

const monthAbbrevs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ProductHoverCard: React.FC<ProductHoverCardProps> = ({ produce, className = '' }) => {
  // Function to determine if a month is available based on availabilityWindows
  const isMonthAvailable = (monthIndex: number): boolean => {
    if (!produce.availabilityWindows || produce.availabilityWindows.length === 0) {
      return false;
    }
    
    return produce.availabilityWindows.some(window => {
      if (window.startMonth === 0 && window.endMonth === 11) {
        // Year-round availability (0-11 means all months)
        return true;
      } else if (window.startMonth <= window.endMonth) {
        // Same year span
        return monthIndex >= window.startMonth && monthIndex <= window.endMonth;
      } else {
        // Cross-year span (e.g., Dec to Mar)
        return monthIndex >= window.startMonth || monthIndex <= window.endMonth;
      }
    });
  };

  return (
    <div className={`bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 w-64 ${className}`}>
      {/* Product Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-3">
        {produce.name}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {produce.description}
      </p>
      
      {/* Month Availability Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-6 gap-1 mb-2">
          {monthAbbrevs.slice(0, 6).map((month, index) => (
            <div
              key={index}
              className={`text-xs text-center py-1 px-1 rounded ${
                isMonthAvailable(index)
                  ? 'bg-green-500 text-white font-medium'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {month}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-1">
          {monthAbbrevs.slice(6, 12).map((month, index) => (
            <div
              key={index + 6}
              className={`text-xs text-center py-1 px-1 rounded ${
                isMonthAvailable(index + 6)
                  ? 'bg-green-500 text-white font-medium'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {month}
            </div>
          ))}
        </div>
      </div>
      
      {/* Price */}
      <div className="text-left">
        <p className="text-sm text-gray-500 mb-1">Starting at</p>
        <p className="text-xl font-bold text-gray-900">
          ${produce.pricePerUnit?.toFixed(2) || '0.00'} / {produce.unit || 'unit'}
        </p>
      </div>
    </div>
  );
};

export default ProductHoverCard;