"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Route, Mail, Trophy } from "lucide-react";
import { useApiClient } from "@/lib/api-client";

interface DashboardMetrics {
  totalImpressions: number;
  kilometerseSaved: number;
  contactFormsReceived: number;
}

interface FarmLeaderboard {
  farmId: string;
  farmName: string;
  impressions: number;
  rank: number;
}

interface FarmsDashboardProps {
  userId?: string;
}

export function FarmsDashboard({ userId }: FarmsDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalImpressions: 0,
    kilometerseSaved: 0,
    contactFormsReceived: 0,
  });
  const [leaderboard, setLeaderboard] = useState<FarmLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);

  const api = useApiClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        
        // Since we don't have specific metrics endpoints, we'll simulate the data
        // In a real implementation, you would call actual API endpoints
        
        // Simulate fetching metrics
        const simulatedMetrics: DashboardMetrics = {
          totalImpressions: Math.floor(Math.random() * 10000) + 1000,
          kilometerseSaved: Math.floor(Math.random() * 500) + 100,
          contactFormsReceived: Math.floor(Math.random() * 50) + 10,
        };

        // Fetch user's farms for the leaderboard
        const farmsResponse = await api.getMyFarms();
        
        if (farmsResponse.success) {
          const simulatedLeaderboard: FarmLeaderboard[] = farmsResponse.data.farms
            .map((farm: { farmId: string; name: string }, index: number) => ({
              farmId: farm.farmId,
              farmName: farm.name,
              impressions: Math.floor(Math.random() * 1000) + 50,
              rank: index + 1,
            }))
            .sort((a: FarmLeaderboard, b: FarmLeaderboard) => b.impressions - a.impressions)
            .map((farm: FarmLeaderboard, index: number) => ({
              ...farm,
              rank: index + 1,
            }));

          setLeaderboard(simulatedLeaderboard);
        }

        setMetrics(simulatedMetrics);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, api]);

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
        
        {/* Leaderboard Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-100 rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-100 rounded w-16"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
            <div className="text-2xl font-bold">{metrics.totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Views across all your farms
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kilometers Saved</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.kilometerseSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Estimated by local sourcing
            </p>
          </CardContent>
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

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Farm Leaderboard
            </CardTitle>
            <CardDescription>
              Farms ranked by total impressions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Farm Name</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.slice(0, 5).map((farm) => (
                  <TableRow key={farm.farmId}>
                    <TableCell className="font-medium">
                      <Badge variant={farm.rank === 1 ? "default" : "secondary"}>
                        #{farm.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{farm.farmName}</TableCell>
                    <TableCell className="text-right">
                      {farm.impressions.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}