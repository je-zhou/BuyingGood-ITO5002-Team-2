'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  className?: string;
}

const LeafletMap = ({ address, className }: LeafletMapProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    // For demo purposes, using approximate coordinates for Australian cities
    // In production, you would use a geocoding service
    const cityCoordinates: Record<string, [number, number]> = {
      'Brisbane': [-27.4698, 153.0251],
      'Gold Coast': [-28.0167, 153.4000],
      'Toowoomba': [-27.5598, 151.9507],
      'Cairns': [-16.9186, 145.7781],
      'Stanthorpe': [-28.6574, 151.9321],
      'Stratford': [-37.2970, 147.0706],
      'Byron Bay': [-28.6474, 153.6020],
      'Roma': [-26.5670, 148.7865],
    };

    const coords = cityCoordinates[address.city];
    if (coords) {
      setCoordinates(coords);
    } else {
      // Default to Brisbane if city not found
      setCoordinates([-27.4698, 153.0251]);
    }
  }, [address.city]);

  if (!coordinates) {
    return (
      <div className={`w-full h-full bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center ${className}`} style={{ zIndex: 1 }}>
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden ${className}`} style={{ zIndex: 1 }}>
      <MapContainer
        center={coordinates}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <div className="text-center">
              <strong>{address.street}</strong><br />
              {address.city}, {address.state} {address.zipCode}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;