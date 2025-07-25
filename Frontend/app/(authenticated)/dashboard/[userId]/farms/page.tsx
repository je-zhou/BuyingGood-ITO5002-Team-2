"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/${resolvedParams?.userId}/farms`}>Farms</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title */}
        <h1 className="font-semibold text-3xl pb-8 pt-4">Farms</h1>

        {/* Wrap the content that needs to load with Suspense */}
        <Suspense fallback={<FarmsSkeletonLoader userId={resolvedParams?.userId} />}>
          <FarmsContent userId={resolvedParams?.userId} />
        </Suspense>
      </div>
    </div>
  );
}

function CreateFarmTile({ userId }: { userId?: string }) {
  if (!userId) return null;
  
  return (
    <Link
      href={`/dashboard/${userId}/farms/create`}
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
      href={`/dashboard/${userId}/farms/${farm.farmId}`}
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

  const fetchFarms = React.useCallback(async () => {
    if (!user || !userId) return;

    // Mock data - replace with real API call when backend is ready
    // Note: Using same data for all userIds for now as requested
    const mockFarms: Farm[] = [
      {
        farmId: "farm-001",
        name: "Green Valley Farm",
        description:
          "Organic vegetables and fruits grown with sustainable farming practices. Family-owned for over 50 years.",
        address: {
          street: "123 Farm Road",
          city: "Springfield",
          state: "CA",
          zipCode: "95123",
        },
        contact_email: "contact@greenvalleyfarm.com",
        contact_phone: "(555) 123-4567",
        opening_hours: "Mon-Sat 8AM-6PM",
        ownerId: userId,
        createdAt: "2024-01-15T08:00:00Z",
      },
      {
        farmId: "farm-002",
        name: "Sunny Acres",
        description:
          "Premium quality berries and seasonal produce. Specializing in strawberries, blueberries, and summer vegetables.",
        address: {
          street: "456 Sunshine Lane",
          city: "Riverside",
          state: "CA",
          zipCode: "92503",
        },
        contact_email: "info@sunnyacres.com",
        contact_phone: "(555) 987-6543",
        opening_hours: "Daily 7AM-7PM",
        ownerId: userId,
        createdAt: "2024-02-20T10:30:00Z",
      },
      {
        farmId: "farm-003",
        name: "Heritage Organic Farm",
        description:
          "Heirloom tomatoes, herbs, and artisanal vegetables. Committed to preserving traditional farming methods.",
        address: {
          street: "789 Heritage Way",
          city: "Fresno",
          state: "CA",
          zipCode: "93720",
        },
        contact_email: "hello@heritageorganic.com",
        contact_phone: "(555) 456-7890",
        opening_hours: "Tue-Sun 9AM-5PM",
        ownerId: userId,
        createdAt: "2024-03-10T12:15:00Z",
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setFarms(mockFarms);
      setLoading(false);
    }, 500);
  }, [user, userId]);

  useEffect(() => {
    if (isLoaded && user && userId) {
      fetchFarms();
    }
  }, [isLoaded, user, userId, fetchFarms]);

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