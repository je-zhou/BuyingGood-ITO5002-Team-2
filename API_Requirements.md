# API Requirements - BuyingGood

## Overview

This document outlines the RESTful API requirements for the Local Farm Registry web application. The system allows farmers to register, manage their farms, and list their produce with availability windows, pricing, and minimum order quantities.

## Base URL

```
TBD
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication & User Management

### 1.1 Register Farmer

**Endpoint:** `POST /auth/register`

**Description:** Register a new farmer account

**Request Body:**

```json
{
  "email": "farmer@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response (201 Created):**

`````json
{
  "success": true,
  "data": {...
  }
}

### 1.2 Update Farmer Details

**Endpoint:** `POST /auth/update`

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "birthday": "",
    "created_at": 1654012591514,
    "email_addresses": [
      {
        "email_address": "example@example.org",
        "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
        "linked_to": [],
        "object": "email_address",
        "reserved": true,
        "verification": {
          "attempts": null,
          "expire_at": null,
          "status": "verified",
          "strategy": "admin"
        }
      }
    ],
    "external_accounts": [],
    "external_id": null,
    "first_name": "Example",
    "gender": "",
    "id": "user_29w83sxmDNGwOuEthce5gg56FcC",
    "image_url": "https://img.clerk.com/xxxxxx",
    "last_name": null,
    "last_sign_in_at": null,
    "object": "user",
    "password_enabled": true,
    "phone_numbers": [],
    "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
    "primary_phone_number_id": null,
    "primary_web3_wallet_id": null,
    "private_metadata": {},
    "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
    "public_metadata": {},
    "two_factor_enabled": false,
    "unsafe_metadata": {},
    "updated_at": 1654012824306,
    "username": null,
    "web3_wallets": []
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654012824306,
  "type": "user.updated"
}
```

**Response (200 OK):**

````json
{
  "success": true,
  "data": {...
  }
}

### 1.3 Delete Farmer Details

**Endpoint:** `POST /auth/delete`

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "deleted": true,
    "id": "user_29wBMCtzATuFJut8jO2VNTVekS4",
    "object": "user"
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1661861640000,
  "type": "user.deleted"
}
```

**Response (200 OK):**

````json
{
  "success": true,
}

### 1.3 Get User Profile

**Endpoint:** `GET /auth/profile`

**Authentication:** Required

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "userId": "uuid-string",
    "email": "farmer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
`````

---

## 2. Farm Management

### 2.1 Register Farm

**Endpoint:** `POST /farms`

**Authentication:** Required

**Description:** Register a new farm for the authenticated farmer

**Request Body:**

```json
{
  "name": "Green Valley Farm",
  "description": "Organic produce farm specializing in vegetables",
  "address": {
    "street": "123 Farm Road",
    "city": "Brisbane",
    "state": "QLD",
    "zipCode": "4000"
  },
  "contact_email": "farmer@example.com",
  "contact_phone": "+61123456789",
  "opening_hours": "TBD",
  "produce": []
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Farm registered successfully",
  "data": {
    "name": "Green Valley Farm",
    "description": "Organic produce farm specializing in vegetables",
    "address": {
      "street": "123 Farm Road",
      "city": "Brisbane",
      "state": "QLD",
      "zipCode": "4000"
    },
    "contact_email": "farmer@example.com",
    "contact_phone": "+61123456789",
    "opening_hours": "TBD",
    "produce": [],
    "ownerId": "uuid-string",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2.2 Get All Farms (Public)

**Endpoint:** `GET /farms`

**Description:** Get list of all registered farms with optional filtering

**Query Parameters:**

- `city` (optional): Filter by city
- `state` (optional): Filter by state
- `categories` (optional): Filter by produce categories
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "farms": [
      {
        "farmId": "uuid-string",
        "name": "Green Valley Farm",
        "description": "Organic produce farm specializing in vegetables",
        "address": {
          "city": "Brisbane",
          "state": "QLD"
        },
        "opening_hours": "TBD",
        "produce": []
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

### 2.3 Get Farm Details

**Endpoint:** `GET /farms/:farmId`

**Description:** Get detailed information about a specific farm

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "farmId": "uuid-string",
    "name": "Green Valley Farm",
    "description": "Organic produce farm specializing in vegetables",
    "address": {
      "street": "123 Farm Road",
      "city": "Brisbane",
      "state": "QLD",
      "zipCode": "4000"
    },
    "contact_email": "farmer@example.com",
    "contact_phone": "+61123456789",
    "opening_hours": "TBD",
    "produce": [],
    "ownerId": "uuid-string",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2.4 Update Farm

**Endpoint:** `PUT /farms/:farmId`

**Authentication:** Required (only farm owner)

**Request Body:** Same as registration, all fields optional.

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Farm updated successfully",
  "data": {
    // Updated farm object
  }
}
```

### 2.5 Delete Farm

**Endpoint:** `DELETE /farms/:farmId`

**Authentication:** Required (only farm owner)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Farm deleted successfully"
}
```

---

## 3. Produce Management

### 3.1 Add Produce to Farm

**Endpoint:** `POST /farms/:farmId/produce`

**Authentication:** Required (only farm owner)

**Description:** Add new produce item to a farm

**Request Body:**

```json
{
  "name": "Organic Tomatoes",
  "category": ["vegetables"],
  "description": "Fresh organic roma tomatoes",
  "pricePerUnit": 4.5,
  "unit": "kg",
  "minimumOrderQuantity": 5,
  "minimumOrderUnit": "kg",
  "availabilityWindows": [
    {
      "startMonth": 11,
      "endMonth": 2
    }
  ],
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Produce added successfully",
  "data": {
    "name": "Organic Tomatoes",
    "category": ["vegetables"],
    "description": "Fresh organic roma tomatoes",
    "pricePerUnit": 4.5,
    "unit": "kg",
    "minimumOrderQuantity": 5,
    "minimumOrderUnit": "kg",
    "availabilityWindows": [
      {
        "startMonth": 11,
        "endMonth": 2
      }
    ],
    "farmId": "farm-uuid",
    "images": ["image1.jpg", "image2.jpg"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3.2 Get All Produce (Public)

**Endpoint:** `GET /produce`

**Description:** Get list of all available produce with filtering and search

**Query Parameters:**

- `category` (optional): Filter by produce category
- `location` (optional): Filter by city or state
- `available` (optional): Filter by current availability (true/false)
- `search` (optional): Search in name and description
- `farmId` (optional): Filter by specific farm
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "produce": [
      {
        "id": "uuid-string",
        "name": "Organic Tomatoes",
        "category": ["vegetables"],
        "description": "Fresh organic roma tomatoes",
        "pricePerUnit": 4.5,
        "unit": "kg",
        "minimumOrderQuantity": 5,
        "minimumOrderUnit": "kg",
        "availabilityWindows": [
          {
            "startMonth": 11,
            "endMonth": 2
          }
        ],
        "farm": {
          "farmId": "uuid-string",
          "name": "Green Valley Farm",
          "city": "Brisbane",
          "state": "QLD"
        },
        "images": ["image1.jpg", "image2.jpg"],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    }
  }
}
```

### 3.3 Get Produce Details

**Endpoint:** `GET /produce/:produceId`

**Description:** Get detailed information about specific produce

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Organic Tomatoes",
    "category": ["vegetables"],
    "description": "Fresh organic roma tomatoes",
    "pricePerUnit": 4.5,
    "unit": "kg",
    "minimumOrderQuantity": 5,
    "minimumOrderUnit": "kg",
    "availabilityWindows": [
      {
        "startMonth": 11,
        "endMonth": 2
      }
    ],
    "farm": {
      "farmId": "uuid-string",
      "name": "Green Valley Farm",
      "address": {
        "street": "123 Farm Road",
        "city": "Brisbane",
        "state": "QLD",
        "zipCode": "4000"
      },
      "ownerId": "uuid-string"
    },
    "images": ["image1.jpg", "image2.jpg"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3.4 Get Farm's Produce

**Endpoint:** `GET /farms/:farmId/produce`

**Description:** Get all produce items for a specific farm

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "farmId": "uuid-string",
    "farmName": "Green Valley Farm",
    "produce": [
      {
        "produceId": "uuid-string",
        "name": "Organic Tomatoes",
        "category": "vegetables",
        "pricePerUnit": 4.5,
        "unit": "kg",
        "currentlyAvailable": true
      }
    ]
  }
}
```

### 3.5 Update Produce

**Endpoint:** `PUT /produce/:produceId`

**Authentication:** Required (only farm owner)

**Request Body:** Same as add produce, all fields optional

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Produce updated successfully",
  "data": {
    // Updated produce object
  }
}
```

### 3.6 Delete Produce

**Endpoint:** `DELETE /produce/:produceId`

**Authentication:** Required (only farm owner)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Produce deleted successfully"
}
```

---

## 4. Categories & Reference Data

### 4.1 Get Produce Categories

**Endpoint:** `GET /categories`

**Description:** Get list of available produce categories

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "categories": [
      "vegetables",
      "fruits",
      "herbs",
      "grains",
      "dairy",
      "meat",
      "eggs"
    ]
  }
}
```

---

## 5. Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details if applicable"
  }
}
```

### Common Error Codes

- `400 BAD_REQUEST` - Invalid request data
- `401 UNAUTHORIZED` - Authentication required or invalid token
- `403 FORBIDDEN` - Insufficient permissions
- `404 NOT_FOUND` - Resource not found
- `409 CONFLICT` - Resource already exists
- `422 VALIDATION_ERROR` - Input validation failed
- `500 INTERNAL_ERROR` - Server error

---

## 6. Data Validation Rules

### Farm Name

- Must be unique per farmer
- 3-100 characters

### Farm Description

- 100-2000 characters

### Produce Name

- Must be unique per farm
- 3-50 characters

### Produce Description

- 100-2000 characters

### Produce Availability Windows

- month must be an integer from 0-11 inclusive. 0 being january, and 11 being december

### Price

- Must be positive number
- Maximum 2 decimal places
- Can be null (on webpage will default to Available on Request or something)

### Minimum Order Quantity

- Must be positive integer

---

## 7. Rate Limiting

- Public endpoints: 100 requests per minute per IP
- Authenticated endpoints: 1000 requests per minute per user
- Registration endpoint: 5 requests per minute per IP

---

## 8. Pagination

All list endpoints support pagination with these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Pagination response format:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```
