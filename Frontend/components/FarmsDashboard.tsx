"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Route, Mail } from "lucide-react";
import { Farm } from "@/lib/api-types";

interface DashboardMetrics {
  totalProfileViews: number;
  kilometerseSaved: number;
  co2Reduced: number;
  contactFormsReceived: number;
  farmCount: number;
}

interface FarmLeaderboard {
  farmId: string;
  farmName: string;
  impressions: number;
  rank: number;
}

interface FarmsDashboardProps {
  userId?: string;
  farms?: Farm[];
}

export function FarmsDashboard({ farms }: FarmsDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProfileViews: 0,
    kilometerseSaved: 0,
    co2Reduced: 0,
    contactFormsReceived: 0,
    farmCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateMetrics = () => {
      if (!farms) {
        setLoading(true);
        return;
      }

      // Calculate aggregated metrics from individual farms
      let totalProfileViews = 0;
      let totalContactForms = 0;
      
      farms.forEach(farm => {
        const farmMetrics = farm.metrics;
        if (farmMetrics) {
          totalProfileViews += farmMetrics.profileViews || 0;
          totalContactForms += farmMetrics.contactForms || 0;
        }
      });

      // Calculate estimated environmental impact
      // Assumptions: avg 10km saved per farm view, 0.21kg CO2 per km
      const kilometerseSaved = totalProfileViews * 10;
      const co2Reduced = kilometerseSaved * 0.21;

      setMetrics({
        totalProfileViews,
        contactFormsReceived: totalContactForms,
        kilometerseSaved: Math.round(kilometerseSaved),
        co2Reduced: Math.round(co2Reduced * 10) / 10, // Round to 1 decimal
        farmCount: farms.length,
      });

      setLoading(false);
    };

    calculateMetrics();
  }, [farms]);

  if (loading) {
    return (
      <div className="space-y-6 mb-8">
        {/* Metrics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProfileViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Views across all your farms
            </p>
          </CardContent>
        </Card>
        
        <Card className="py-0 gap-0">
          <Tabs defaultValue="kilometers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-t-xl rounded-b-none">
              <TabsTrigger value="kilometers" className="text-xs">
                <Route className="h-3 w-3 mr-1" />
                Kilometers
              </TabsTrigger>
              <TabsTrigger value="co2" className="text-xs">
                <span className="text-xs font-bold mr-1">CO₂</span>
                Emissions
              </TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="kilometers" className="mt-0 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{metrics.kilometerseSaved.toLocaleString()} km</div>
                  <div className="text-sm text-green-600 font-medium">
                    ≈ {Math.round(metrics.kilometerseSaved * 0.1)} trees saved
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Distance saved through local farm sourcing
                </p>
              </TabsContent>
              <TabsContent value="co2" className="mt-0 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{metrics.co2Reduced.toLocaleString()} kg</div>
                  <div className="text-sm text-green-600 font-medium">
                    ≈ {Math.round(metrics.kilometerseSaved * 0.1)} trees saved
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Carbon emissions reduced by choosing local farms
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.contactFormsReceived}</div>
            <p className="text-xs text-muted-foreground">
              Inquiries received this month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}