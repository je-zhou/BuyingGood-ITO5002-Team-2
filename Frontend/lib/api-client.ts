"use client";

import { useAuth } from "@clerk/nextjs";
import { useMemo, useCallback } from "react";

// const API_BASE_URL = "https://buyinggood-api.onrender.com"; // Iteration 1 URL
const API_BASE_URL = "https://buyinggood-ito5002-team-2-v2.onrender.com";

// Simple API client for unauthenticated requests (no React hooks)
export const unauthenticatedApiClient = {
  async getFarms(searchParams?: URLSearchParams) {
    const url = searchParams
      ? `${API_BASE_URL}/farms?${searchParams.toString()}`
      : `${API_BASE_URL}/farms`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorDetails = {
        url,
        method: "GET",
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString(),
      };

      const errorMessage = `API Error:\n\nURL: ${errorDetails.url}\nMethod: ${errorDetails.method}\nStatus: ${errorDetails.status} (${errorDetails.statusText})\nTimestamp: ${errorDetails.timestamp}`;

      throw new Error(errorMessage);
    }

    return response.json();
  },

  async getFarmById(farmId: string) {
    const url = `${API_BASE_URL}/farms/${farmId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  },
};

// Detailed error information for debugging
interface ApiError {
  url: string;
  method: string;
  status: number | null;
  statusText: string;
  headers: Record<string, string>;
  requestHeaders: Record<string, string>;
  responseBody: unknown;
  browserError: string;
  timestamp: string;
  cors: boolean;
}

// Enhanced error handler for debugging
function createDetailedError(
  url: string,
  method: string,
  requestHeaders: Record<string, string>,
  response?: Response,
  error?: unknown
): ApiError {
  const timestamp = new Date().toISOString();

  const detailedError: ApiError = {
    url,
    method,
    status: response?.status || null,
    statusText: response?.statusText || "No Response",
    headers: {},
    requestHeaders,
    responseBody: null,
    browserError: error instanceof Error ? error.message : "Unknown error",
    timestamp,
    cors: false,
  };

  // Check if it's a CORS error
  const errorMessage = error instanceof Error ? error.message : "";
  if (
    errorMessage.includes("CORS") ||
    errorMessage.includes("Cross-Origin") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("NetworkError")
  ) {
    detailedError.cors = true;
  }

  // Capture response headers if available
  if (response) {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    detailedError.headers = headers;
  }

  return detailedError;
}

// Display raw error details
function displayDetailedError(error: ApiError): string {
  const errorReport = `API ERROR:

Timestamp: ${error.timestamp}
URL: ${error.url}
Method: ${error.method}
Status: ${error.status || "No Status"} (${error.statusText})
CORS Issue: ${error.cors ? "Yes" : "No"}

Request Headers:
${JSON.stringify(error.requestHeaders, null, 2)}

Response Headers:
${JSON.stringify(error.headers, null, 2)}

Browser Error:
${error.browserError}

Response Body:
${
  error.responseBody
    ? JSON.stringify(error.responseBody, null, 2)
    : "No response body received"
}`;

  console.error(errorReport);
  return errorReport;
}

// Client-side API wrapper that uses Clerk's useAuth hook
export function useApiClient() {
  const { getToken } = useAuth();

  const getAuthHeaders = useCallback(
    async (requireAuth: boolean = true): Promise<Record<string, string>> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (requireAuth) {
        const token = await getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      return headers;
    },
    [getToken]
  );

  // Helper function for API calls with detailed error handling
  const makeApiCall = useCallback(
    async (
      url: string,
      method: string,
      headers: Record<string, string>,
      body?: object
    ) => {
      try {
        const response = await fetch(url, {
          method,
          headers,
          ...(body && { body: JSON.stringify(body) }),
          cache: "no-store",
        });

        let responseBody = null;
        try {
          responseBody = await response.clone().json();
        } catch {
          try {
            responseBody = await response.clone().text();
          } catch {
            responseBody = "Could not read response body";
          }
        }

        if (!response.ok) {
          const error = createDetailedError(url, method, headers, response);
          error.responseBody = responseBody;

          // Log detailed error for developers
          const errorReport = displayDetailedError(error);

          // Throw detailed error for developers to see in UI
          throw new Error(errorReport);
        }

        return responseBody;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "";
        if (errorMessage.includes("🚨")) {
          // Already a detailed error, re-throw it
          throw error;
        }

        // Network or other error
        const detailedError = createDetailedError(
          url,
          method,
          headers,
          undefined,
          error
        );

        // Log and throw detailed error for developers to see in UI
        const errorReport = displayDetailedError(detailedError);
        throw new Error(errorReport);
      }
    },
    []
  );

  return useMemo(
    () => ({
      // Farm API functions
      async getFarms(
        searchParams?: URLSearchParams,
        requireAuth: boolean = true
      ) {
        const headers = await getAuthHeaders(requireAuth);
        const url = searchParams
          ? `${API_BASE_URL}/farms?${searchParams.toString()}`
          : `${API_BASE_URL}/farms`;

        return makeApiCall(url, "GET", headers);
      },

      async getFarmById(farmId: string, requireAuth: boolean = false) {
        const headers = await getAuthHeaders(requireAuth);
        return makeApiCall(`${API_BASE_URL}/farms/${farmId}`, "GET", headers);
      },

      async createFarm(farmData: object) {
        const headers = await getAuthHeaders();
        return makeApiCall(`${API_BASE_URL}/farms`, "POST", headers, farmData);
      },

      async updateFarm(farmId: string, updates: object) {
        const headers = await getAuthHeaders();
        return makeApiCall(
          `${API_BASE_URL}/farms/${farmId}`,
          "PUT",
          headers,
          updates
        );
      },

      async deleteFarm(farmId: string) {
        const headers = await getAuthHeaders();
        return makeApiCall(
          `${API_BASE_URL}/farms/${farmId}`,
          "DELETE",
          headers
        );
      },

      // Produce/Products API functions
      async getFarmProduce(farmId: string, searchParams?: URLSearchParams) {
        const headers = await getAuthHeaders();
        const url = searchParams
          ? `${API_BASE_URL}/farms/${farmId}/produce?${searchParams.toString()}`
          : `${API_BASE_URL}/farms/${farmId}/produce`;

        return makeApiCall(url, "GET", headers);
      },

      async getProduceById(produceId: string) {
        const headers = await getAuthHeaders();
        return makeApiCall(
          `${API_BASE_URL}/produce/${produceId}`,
          "GET",
          headers
        );
      },

      async createProduce(farmId: string, produceData: object) {
        const headers = await getAuthHeaders();
        return makeApiCall(
          `${API_BASE_URL}/farms/${farmId}/produce`,
          "POST",
          headers,
          produceData
        );
      },

      async updateProduce(produceId: string, updates: object) {
        const headers = await getAuthHeaders();
        return makeApiCall(
          `${API_BASE_URL}/produce/${produceId}`,
          "PUT",
          headers,
          updates
        );
      },

      async deleteProduce(produceId: string) {
        const headers = await getAuthHeaders();
        return makeApiCall(
          `${API_BASE_URL}/produce/${produceId}`,
          "DELETE",
          headers
        );
      },

      async getMyFarms(searchParams?: URLSearchParams) {
        const headers = await getAuthHeaders();
        const url = searchParams
          ? `${API_BASE_URL}/my_farms?${searchParams.toString()}`
          : `${API_BASE_URL}/my_farms`;

        return makeApiCall(url, "GET", headers);
      },

      // Auth API functions
      async getUserProfile() {
        const headers = await getAuthHeaders();
        return makeApiCall(`${API_BASE_URL}/auth/profile`, "GET", headers);
      },
    }),
    [getAuthHeaders, makeApiCall]
  );
}
