"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar/SearchBar";
import ProductHoverCard from "@/components/ProductHoverCard/ProductHoverCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { unauthenticatedApiClient } from "@/lib/api-client";
import { Farm, Produce } from "@/lib/api-types";

interface SearchResponse {
  success: boolean;
  data: {
    farms: Farm[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// API function to fetch farms
async function fetchFarms(params: {
  query?: string;
  page?: number;
  distance?: number;
  categories?: string[];
}) {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set("q", params.query);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.distance) searchParams.set("distance", params.distance.toString());
  if (params.categories && params.categories.length > 0) {
    searchParams.set("categories", params.categories.join(","));
  }

  return unauthenticatedApiClient.getFarms(searchParams);
}

function FarmsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for form inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [distanceWithin, setDistanceWithin] = useState(50);
  const [categories, setCategories] = useState({
    fruits: true,
    vegetables: true,
    legumes: true,
    nutsSeeds: true,
    grain: true,
    livestock: true,
    seafood: true,
    eggsAndMilk: true,
    coffeeAndTea: true,
    herbsAndSpices: true,
    forestry: true,
    honey: true,
  });

  // State for API data
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allFarms, setAllFarms] = useState<Farm[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Hover states
  const [hoveredFarm, setHoveredFarm] = useState<string | null>(null);
  const [hoveredProduce, setHoveredProduce] = useState<Produce | null>(null);

  // Refs for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(1);

  // Initialize state from URL parameters
  useEffect(() => {
    const query = searchParams.get("q") || "";
    const distance = parseInt(searchParams.get("distance") || "50");
    const categoriesParam = searchParams.get("categories");

    setSearchQuery(query);
    setDistanceWithin(distance);

    if (categoriesParam) {
      const selectedCategories = categoriesParam.split(",");
      setCategories((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key as keyof typeof updated] =
            selectedCategories.includes(key);
        });
        return updated;
      });
    } else {
      // If no categories in URL, select all (this is the default behavior)
      setCategories({
        fruits: true,
        vegetables: true,
        legumes: true,
        nutsSeeds: true,
        grain: true,
        livestock: true,
        seafood: true,
        eggsAndMilk: true,
        coffeeAndTea: true,
        herbsAndSpices: true,
        forestry: true,
        honey: true,
      });
    }

    // Reset for new search
    setAllFarms([]);
    currentPageRef.current = 1;
    setHasNextPage(true);

    // Perform initial search
    performSearch({
      query,
      page: 1,
      distance,
      categories: categoriesParam ? categoriesParam.split(",") : [],
      reset: true,
    });
  }, [searchParams]);

  const performSearch = async (params: {
    query?: string;
    page?: number;
    distance?: number;
    categories?: string[];
    reset?: boolean;
  }) => {
    if (params.reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const data = await fetchFarms(params);
      setSearchData(data);

      if (params.reset) {
        setAllFarms(data.data.farms);
      } else {
        setAllFarms((prev) => [...prev, ...data.data.farms]);
      }

      // Update pagination state
      currentPageRef.current = data.data.pagination.currentPage;
      // Stop loading more if we've reached the last page OR if the returned farms array is empty
      const hasMorePages =
        data.data.pagination.currentPage < data.data.pagination.totalPages;
      const hasResults = data.data.farms.length > 0;
      setHasNextPage(hasMorePages && hasResults);
    } catch (err) {
      // Show the full detailed error message for developers
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);

      if (params.reset) {
        setSearchData(null);
        setAllFarms([]);
      }
    } finally {
      if (params.reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const handleSearch = () => {
    const selectedCategories = Object.entries(categories)
      .filter(([, selected]) => selected)
      .map(([category]) => category);

    const allCategories = Object.keys(categories);
    const allSelected = selectedCategories.length === allCategories.length;

    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (distanceWithin !== 50)
      params.set("distance", distanceWithin.toString());
    // Only add categories to URL if not all are selected (to keep URL clean)
    if (!allSelected && selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    router.push(`/farms?${params.toString()}`);
  };

  // Load more function for infinite scroll
  const loadMore = useCallback(async () => {
    if (!hasNextPage || loadingMore || loading) return;

    const query = searchParams.get("q") || "";
    const distance = parseInt(searchParams.get("distance") || "50");
    const categoriesParam = searchParams.get("categories");

    await performSearch({
      query,
      page: currentPageRef.current + 1,
      distance,
      categories: categoriesParam ? categoriesParam.split(",") : [],
      reset: false,
    });
  }, [hasNextPage, loadingMore, loading, searchParams]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !loadingMore &&
          !loading
        ) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasNextPage, loadingMore, loading]);

  const handleCategoryChange = (
    category: keyof typeof categories,
    checked: boolean
  ) => {
    setCategories((prev) => ({
      ...prev,
      [category]: checked,
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(categories).every((value) => value);
    const newValue = !allSelected;
    setCategories((prev) =>
      Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: newValue,
        }),
        {} as typeof categories
      )
    );
  };

  // Get data from state or show loading/error states
  const farms = allFarms;
  const pagination = searchData?.data.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {loading
            ? "Searching..."
            : `${pagination.totalItems} Farms Found Near You`}
        </h1>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          distanceWithin={distanceWithin}
          onDistanceChange={setDistanceWithin}
          categories={categories}
          onCategoryChange={handleCategoryChange}
          onSelectAll={handleSelectAll}
        />

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Searching for farms...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                Error Details
              </h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap bg-red-100 p-4 rounded border overflow-auto max-h-96">
                {error}
              </pre>
              <div className="mt-4 text-center">
                <Button
                  onClick={() => handleSearch()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Farm Results */}
        {!loading && !error && (
          <div className="mt-8 space-y-6">
            {farms.map((farm) => (
              <div
                key={farm.farmId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex gap-6">
                  {/* Farm Image Placeholder */}
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0"></div>

                  {/* Farm Info */}
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {farm.name}
                    </h2>
                    <p className="text-gray-600 mb-3">
                      {farm.address?.city} {farm.address?.state}
                    </p>
                    <Link href={`/farms/${farm.farmId}`}>
                      <Button
                        variant="outline"
                        className=" border-primary text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        View More
                      </Button>
                    </Link>
                  </div>

                  {/* Produce Buttons */}
                  <div className="flex-shrink-0">
                    <div className="flex flex-wrap gap-2 justify-end">
                      {farm.produce?.map((produce) => (
                        <div key={produce.produceId} className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            className="min-w-16"
                            onMouseEnter={() => {
                              setHoveredFarm(farm.farmId);
                              setHoveredProduce(produce);
                            }}
                            onMouseLeave={() => {
                              setHoveredFarm(null);
                              setHoveredProduce(null);
                            }}
                          >
                            {produce.name}
                          </Button>

                          {/* Hover Card */}
                          {hoveredFarm === farm.farmId &&
                            hoveredProduce?.produceId === produce.produceId && (
                              <div className="absolute top-full right-0 mt-2 z-10">
                                <ProductHoverCard produce={produce} />
                              </div>
                            )}
                        </div>
                      )) || (
                        <div className="text-sm text-gray-500 italic">
                          No produce listed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Loading */}
        {!loading && !error && hasNextPage && (
          <div ref={observerTarget} className="mt-8 flex justify-center py-8">
            {loadingMore ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Loading more farms...
                </p>
              </div>
            ) : (
              <Button
                onClick={loadMore}
                variant="outline"
                className="px-8 py-2"
              >
                Load More Farms
              </Button>
            )}
          </div>
        )}

        {/* End of Results */}
        {!loading && !error && !hasNextPage && farms.length > 0 && (
          <div className="mt-8 text-center py-8">
            <p className="text-sm text-gray-600">
              You&apos;ve reached the end! Showing all {pagination.totalItems}{" "}
              farms.
            </p>
          </div>
        )}

        {/* Results Info */}
        {!loading && !error && farms.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {farms.length} of {pagination.totalItems} farms
          </div>
        )}
      </div>
    </div>
  );
}

export default function FarmsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <div className="mt-8 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading farms...</p>
            </div>
          </div>
        </div>
      }
    >
      <FarmsPageContent />
    </Suspense>
  );
}
