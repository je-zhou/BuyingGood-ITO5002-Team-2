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
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  className?: string;
}

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
}

const LeafletMap = ({ address, className }: LeafletMapProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addressUsed, setAddressUsed] = useState<string>('');

  // Geocoding function using Nominatim (OpenStreetMap)
  const geocodeAddress = async (query: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=au&limit=1`,
        {
          headers: {
            'User-Agent': 'BuyingGood-Farm-Locator/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const data: GeocodeResult[] = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return [parseFloat(result.lat), parseFloat(result.lon)];
      }
      
      return null;
    } catch (error) {
      console.warn('Geocoding failed for query:', query, error);
      return null;
    }
  };

  useEffect(() => {
    const loadCoordinates = async () => {
      setIsLoading(true);
      
      // Fallback coordinates (Brisbane, Australia)
      const fallbackCoords: [number, number] = [-27.4698, 153.0251];
      
      // Build address queries with fallback logic
      const queries: { query: string; type: string }[] = [];
      
      // Try full address first
      if (address.street && address.city && address.state) {
        const fullAddress = `${address.street}, ${address.city}, ${address.state}${address.zipCode ? ` ${address.zipCode}` : ''}, Australia`;
        queries.push({ query: fullAddress, type: 'full address' });
      }
      
      // Try street + city
      if (address.street && address.city) {
        const streetCity = `${address.street}, ${address.city}, Australia`;
        queries.push({ query: streetCity, type: 'street and city' });
      }
      
      // Try city + state
      if (address.city && address.state) {
        const cityState = `${address.city}, ${address.state}, Australia`;
        queries.push({ query: cityState, type: 'city and state' });
      }
      
      // Try just city
      if (address.city) {
        const cityOnly = `${address.city}, Australia`;
        queries.push({ query: cityOnly, type: 'city only' });
      }
      
      // Try just state
      if (address.state) {
        const stateOnly = `${address.state}, Australia`;
        queries.push({ query: stateOnly, type: 'state only' });
      }
      
      // Try geocoding with fallback logic
      for (const { query, type } of queries) {
        try {
          const coords = await geocodeAddress(query);
          if (coords) {
            setCoordinates(coords);
            setAddressUsed(`Found using ${type}: ${query}`);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.warn(`Geocoding failed for ${type}:`, query, error);
          continue;
        }
      }
      
      // If all geocoding attempts fail, use Brisbane as fallback
      console.warn('All geocoding attempts failed, using Brisbane as fallback');
      setCoordinates(fallbackCoords);
      setAddressUsed('Using fallback location (Brisbane, Australia)');
      setIsLoading(false);
    };

    loadCoordinates();
  }, [address.street, address.city, address.state, address.zipCode]);

  if (!coordinates || isLoading) {
    return (
      <div className={`w-full h-full bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center ${className}`} style={{ zIndex: 1 }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mb-2"></div>
          <span className="text-gray-500 block">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`} style={{ zIndex: 1 }}>
      <MapContainer
        center={coordinates}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full block"
        style={{ zIndex: 1, display: 'block' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <div className="text-center">
              <div className="font-semibold mb-1">
                {[address.street, address.city, address.state, address.zipCode]
                  .filter(Boolean)
                  .join(', ') || 'Farm Location'}
              </div>
              {addressUsed && (
                <div className="text-xs text-gray-600 mt-1">
                  {addressUsed}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;