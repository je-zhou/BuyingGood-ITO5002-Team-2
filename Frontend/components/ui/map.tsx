'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface MapProps {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  className?: string;
}

const Map = ({ address, className }: MapProps) => {
  const MapComponent = useMemo(
    () =>
      dynamic(() => import('./LeafletMap'), {
        loading: () => (
          <div className={`w-full h-full bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center ${className}`} style={{ zIndex: 1 }}>
            <span className="text-gray-500">Loading map...</span>
          </div>
        ),
        ssr: false,
      }),
    [className]
  );

  return <MapComponent address={address} className={className} />;
};

export default Map;