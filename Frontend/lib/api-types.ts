/* eslint-disable @typescript-eslint/no-explicit-any */

// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

// Pagination structure
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// User/Auth related interfaces
export interface User {
  userId: string; // Note: Backend uses 'userId' not 'id'
  firstName: string;
  lastName: string;
  birthday?: number; // Unix timestamp or null
  gender?: string;
  phoneNumber?: string;
  email: string;
  profileImage?: string;
  updatedAt: number; // Unix timestamp
}

export interface AuthRegisterResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Farm related interfaces
export interface Farm {
  farmId: string; // Note: Backend converts '_id' to 'farmId'
  name?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  contact_email?: string;
  contact_phone?: string;
  opening_hours?: string;
  ownerId: string; // ObjectId converted to string
  createdAt: number; // Unix timestamp
  modifiedAt?: number; // Unix timestamp
  produce?: Produce[]; // Note: Not included in GET /farms response, only in individual farm details
  // Note: Requirements show different field names
}

export interface FarmsListResponse {
  farms: Farm[];
  pagination: Pagination;
}

// Produce related interfaces
export interface AvailabilityWindow {
  startMonth: number; // 0-11 (Jan-Dec)
  endMonth: number; // 0-11 (Jan-Dec)
}

export interface Produce {
  produceId: string; // Note: Backend converts '_id' to 'produceId'
  name: string;
  category?: string[]; // Requirements show array, backend may differ
  description?: string;
  pricePerUnit?: number;
  unit?: string;
  minimumOrderQuantity?: number;
  minimumOrderUnit?: string;
  availabilityWindows?: AvailabilityWindow[];
  images?: string[];
  farmId: string; // ObjectId converted to string
  createdAt: number; // Unix timestamp
  modifiedAt: number; // Unix timestamp
  // Note: When fetched individually, includes 'farm' nested object
  farm?: Farm;
}

export interface FarmProduceResponse {
  farmId: string;
  farmName: string;
  produce: Produce[];
  pagination: Pagination;
}

// Categories
export interface CategoriesResponse {
  categories: string[];
}

// ================================
// DISCREPANCIES FOUND:
// ================================

/* 
BACKEND BUGS IDENTIFIED:

1. Line 415 in app.py: create_farm() inserts into db.produce instead of db.farms
   This is clearly a bug as farms should go in the farms collection.

2. Missing /produce endpoint: Requirements specify GET /produce for all produce,
   but backend doesn't implement this endpoint.

FIELD NAME MISMATCHES:

1. User Profile:
   - Backend returns: userId, firstName, lastName, birthday, gender, phoneNumber, email, profileImage, updatedAt
   - Requirements expect: userId, email, firstName, lastName, createdAt, updatedAt
   - Missing: createdAt field in backend

2. Farm Objects:
   - Backend uses: farmId, ownerId, createdAt, modifiedAt
   - Requirements expect: farmId, name, description, address, contact_email, contact_phone, opening_hours, ownerId, createdAt
   - Backend may have inconsistent field names for farm properties

3. Produce Objects:
   - Backend uses: produceId, farmId, createdAt, modifiedAt
   - Requirements expect: id (not produceId), farm nested object
   - Field naming inconsistencies for produce properties

DATA TYPE MISMATCHES:

1. Timestamps:
   - Backend returns Unix timestamps as numbers
   - Requirements show ISO date strings
   - Frontend may expect ISO strings

2. Category field:
   - Requirements show array: ["vegetables"]
   - Backend implementation unclear if it handles arrays

3. Address structure:
   - Requirements show nested address object
   - Backend implementation may flatten these fields

MISSING ENDPOINTS:

1. GET /produce - Get all produce across all farms
2. Proper error response structure in some endpoints

AUTHENTICATION ISSUES:

1. Some endpoints marked as requiring authentication in requirements
   but frontend calls them without auth (like getFarmById)

RECOMMENDATIONS:

1. Fix the database collection bug in create_farm()
2. Standardize field naming between backend and requirements
3. Implement missing /produce endpoint
4. Ensure consistent timestamp format
5. Add proper TypeScript interfaces to frontend
6. Validate that category field handles arrays properly
7. Review authentication requirements for public endpoints
*/
