"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useApiClient } from "@/lib/api-client";

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

export default function FarmsPage({ params }: { params: Promise<{ userId: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ userId: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <h1 className="font-semibold text-3xl pb-8">Farms</h1>

        {/* Wrap the content that needs to load with Suspense */}
        <Suspense fallback={<FarmsSkeletonLoader userId={resolvedParams?.userId} />}>
          <FarmsContent userId={resolvedParams?.userId} />
        </Suspense>
    </div>
  );
}

function CreateFarmTile({ userId }: { userId?: string }) {
  if (!userId) return null;
  
  return (
    <Link
      href={`/dashboard/${userId}/my-farms/create`}
      className="rounded w-full bg-gray-100 flex items-center justify-center space-x-1"
    >
      <Plus className="w-4 h-4" />
      <p className="text-gray-500 font-semibold text-sm">New Farm</p>
    </Link>
  );
}

function FarmTile({ farm, userId }: { farm: Farm; userId?: string }) {
  if (!userId) return null;
  
  return (
    <Link
      href={`/dashboard/${userId}/my-farms/${farm.farmId}`}
      className="rounded w-full flex flex-col border border-gray-200"
    >
      <div className="w-full border-b border-gray-200 rounded-t flex items-center p-4 justify-between">
        <div className="leading-none">
          <p className="font-semibold">{farm.name}</p>
          <p className="text-gray-400 text-sm">
            {farm.address.city}, {farm.address.state}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-500">Active</span>
        </div>
      </div>
      <div className="w-full h-full px-4 py-2 space-y-2">
        <p className="capitalize text-sm text-gray-500">Farm Registry</p>
        <p className="text-sm line-clamp-2">{farm.description}</p>
      </div>
      <div className="px-4 py-3 rounded-b border-t bg-gray-50">
        <p className="text-left text-xs font-semibold text-gray-600">
          {farm.farmId}
        </p>
      </div>
    </Link>
  );
}

// This component will render the actual farms content
const FarmsContent = ({ userId }: { userId?: string }) => {
  const { user, isLoaded } = useUser();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get API client
  const api = useApiClient();

  // Memoize the fetch function to avoid recreating it on every render
  const fetchFarms = useCallback(async () => {
    if (!isLoaded || !user || !userId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Fetch farms for the current user using client API
      const data = await api.getFarms();
      
      if (data.success) {
        // Filter farms by owner if backend doesn't do it
        const userFarms = data.data.farms.filter((farm: Farm) => farm.ownerId === userId);
        setFarms(userFarms);
      }
      
    } catch (error) {
      console.error('Error fetching farms:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while fetching farms";
      setError(errorMessage);
      setFarms([]);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user, userId, api]);

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  // Separate function for retry button
  const retryFetch = () => {
    fetchFarms();
  };

  if (!isLoaded || loading) {
    return <FarmsSkeletonLoader userId={userId} />;
  }

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        User not found
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Error Details</h3>
          <pre className="text-sm text-red-700 whitespace-pre-wrap bg-red-100 p-4 rounded border overflow-auto max-h-96">
            {error}
          </pre>
          <div className="mt-4">
            <button 
              onClick={() => retryFetch()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Farms Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 auto-rows-[minmax(14rem,_1fr)] gap-4">
        <CreateFarmTile userId={userId} />
        {farms.map((farm) => (
          <FarmTile key={farm.farmId} farm={farm} userId={userId} />
        ))}
      </div>
    </>
  );
};

// Skeleton loader component for farm tiles
function FarmTileSkeleton() {
  return (
    <div className="rounded w-full flex flex-col border border-gray-200 animate-pulse">
      <div className="w-full border-b border-gray-200 rounded-t flex items-center p-4 justify-between">
        <div className="leading-none">
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-32"></div>
        </div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="w-full h-full px-4 py-2 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="px-4 py-3 bg-gray-300 rounded-b">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

// Skeleton loader component for the whole farms grid
function FarmsSkeletonLoader({ userId }: { userId?: string }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 auto-rows-[minmax(14rem,_1fr)] gap-4">
      <CreateFarmTile userId={userId} />
      {[...Array(2)].map((_, index) => (
        <FarmTileSkeleton key={index} />
      ))}
    </div>
  );
}