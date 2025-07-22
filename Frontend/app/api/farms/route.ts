import { NextRequest, NextResponse } from 'next/server';

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
  produce: Produce[];
  ownerId: string;
  createdAt: string;
}

interface Produce {
  id: string;
  name: string;
  category: string[];
  description: string;
  pricePerUnit: number;
  unit: string;
  minimumOrderQuantity: number;
  minimumOrderUnit: string;
  availabilityWindows: {
    startMonth: number;
    endMonth: number;
  }[];
  images: string[];
  createdAt: string;
}

interface FarmsApiResponse {
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

// Extended dummy data with more farms and categories
const allFarms: Farm[] = [
  {
    farmId: "farm-1",
    name: "Green Valley Organic Farm",
    description: "Certified organic farm specializing in fresh vegetables and herbs. We pride ourselves on sustainable farming practices and providing the freshest produce to our local community.",
    address: { 
      street: "123 Farm Road",
      city: "Brisbane", 
      state: "QLD",
      zipCode: "4000"
    },
    contact_email: "contact@greenvalleyfarm.com",
    contact_phone: "+61731234567",
    opening_hours: "Mon-Fri: 7AM-5PM, Sat-Sun: 8AM-4PM",
    ownerId: "user-1",
    createdAt: "2024-01-15T10:30:00Z",
    produce: [
      { 
        id: "1", 
        name: "Honey", 
        category: ["honey"],
        description: "Premium raw honey harvested from our own beehives. Golden and aromatic with floral notes.",
        pricePerUnit: 4.92, 
        unit: "l", 
        minimumOrderQuantity: 1,
        minimumOrderUnit: "l",
        availabilityWindows: [{ startMonth: 0, endMonth: 5 }],
        images: ["honey1.jpg", "honey2.jpg"],
        createdAt: "2024-01-15T10:30:00Z"
      },
      { 
        id: "2", 
        name: "Fresh Tomatoes", 
        category: ["vegetables"],
        description: "Vine-ripened organic tomatoes, perfect for salads, cooking, and preserving. Rich red color and full flavor.",
        pricePerUnit: 8.99, 
        unit: "kg", 
        minimumOrderQuantity: 2,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 2, endMonth: 8 }],
        images: ["tomatoes1.jpg", "tomatoes2.jpg"],
        createdAt: "2024-01-15T10:30:00Z"
      },
      { 
        id: "3", 
        name: "Basil", 
        category: ["herbs"],
        description: "Fresh sweet basil leaves, perfect for cooking, pesto, and garnishes. Aromatic and flavorful.",
        pricePerUnit: 4.50, 
        unit: "bunch", 
        minimumOrderQuantity: 1,
        minimumOrderUnit: "bunch",
        availabilityWindows: [{ startMonth: 3, endMonth: 9 }],
        images: ["basil1.jpg", "basil2.jpg"],
        createdAt: "2024-01-15T10:30:00Z"
      }
    ]
  },
  {
    farmId: "farm-2",
    name: "Sunshine Citrus Grove",
    description: "Premium citrus fruits and seasonal produce grown under the Queensland sunshine. Our grove specializes in high-quality citrus with exceptional flavor and freshness.",
    address: {
      street: "456 Citrus Lane",
      city: "Gold Coast",
      state: "QLD",
      zipCode: "4217"
    },
    contact_email: "info@sunshinecitrus.com.au",
    contact_phone: "+61755554321",
    opening_hours: "Daily: 6AM-6PM",
    ownerId: "user-2",
    createdAt: "2024-01-20T08:15:00Z",
    produce: [
      {
        id: "4",
        name: "Valencia Oranges",
        category: ["fruits"],
        description: "Sweet and juicy Valencia oranges perfect for fresh juice or eating. Grown in our premium groves with optimal sunshine exposure.",
        pricePerUnit: 6.75,
        unit: "kg",
        minimumOrderQuantity: 2,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 4, endMonth: 10 }],
        images: ["valencia_oranges1.jpg", "valencia_oranges2.jpg"],
        createdAt: "2024-01-20T08:15:00Z"
      },
      {
        id: "5",
        name: "Lemons",
        category: ["fruits"],
        description: "Bright, tangy lemons with high juice content. Perfect for cooking, beverages, and preserving. Fresh from our organic grove.",
        pricePerUnit: 5.25,
        unit: "kg",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["lemons1.jpg", "lemons2.jpg"],
        createdAt: "2024-01-20T08:15:00Z"
      },
      {
        id: "6",
        name: "Limes",
        category: ["fruits"],
        description: "Fresh, aromatic limes with intense citrus flavor. Ideal for cocktails, cooking, and marinades. Limited seasonal availability.",
        pricePerUnit: 7.99,
        unit: "kg",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 6, endMonth: 11 }, { startMonth: 0, endMonth: 2 }],
        images: ["limes1.jpg", "limes2.jpg"],
        createdAt: "2024-01-20T08:15:00Z"
      }
    ]
  },
  {
    farmId: "farm-3",
    name: "Heritage Grain Co",
    description: "Ancient grains and legumes using traditional farming methods passed down through generations. We focus on heritage varieties and sustainable agriculture practices.",
    address: {
      street: "789 Heritage Road",
      city: "Toowoomba",
      state: "QLD",
      zipCode: "4350"
    },
    contact_email: "hello@heritagegrain.com.au",
    contact_phone: "+61746667890",
    opening_hours: "Mon-Sat: 8AM-4PM",
    ownerId: "user-3",
    createdAt: "2024-02-01T09:45:00Z",
    produce: [
      {
        id: "7",
        name: "Quinoa",
        category: ["grain"],
        description: "Premium organic quinoa with complete protein profile. Ancient grain perfect for healthy meals and gluten-free diets.",
        pricePerUnit: 18.50,
        unit: "kg",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 2, endMonth: 6 }],
        images: ["quinoa1.jpg", "quinoa2.jpg"],
        createdAt: "2024-02-01T09:45:00Z"
      },
      {
        id: "8",
        name: "Black Beans",
        category: ["legumes"],
        description: "Nutrient-rich black beans with excellent protein and fiber content. Perfect for soups, salads, and traditional dishes.",
        pricePerUnit: 12.99,
        unit: "kg",
        minimumOrderQuantity: 2,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 1, endMonth: 7 }],
        images: ["black_beans1.jpg", "black_beans2.jpg"],
        createdAt: "2024-02-01T09:45:00Z"
      },
      {
        id: "9",
        name: "Lentils",
        category: ["legumes"],
        description: "High-quality lentils rich in protein and minerals. Versatile ingredient for soups, curries, and healthy plant-based meals.",
        pricePerUnit: 9.75,
        unit: "kg",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 1, endMonth: 8 }],
        images: ["lentils1.jpg", "lentils2.jpg"],
        createdAt: "2024-02-01T09:45:00Z"
      }
    ]
  },
  {
    farmId: "farm-4",
    name: "Coastal Seafood Farm",
    description: "Sustainable aquaculture and fresh seafood from pristine Queensland waters. We practice responsible farming methods to ensure the highest quality seafood.",
    address: {
      street: "321 Marina Drive",
      city: "Cairns",
      state: "QLD",
      zipCode: "4870"
    },
    contact_email: "orders@coastalseafood.com.au",
    contact_phone: "+61740123456",
    opening_hours: "Tue-Sun: 5AM-2PM",
    ownerId: "user-4",
    createdAt: "2024-01-25T06:30:00Z",
    produce: [
      {
        id: "10",
        name: "Barramundi",
        category: ["seafood"],
        description: "Premium Australian barramundi, sustainably farmed in clean waters. Mild, flaky white fish perfect for grilling or steaming.",
        pricePerUnit: 28.99,
        unit: "kg",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["barramundi1.jpg", "barramundi2.jpg"],
        createdAt: "2024-01-25T06:30:00Z"
      },
      {
        id: "11",
        name: "Prawns",
        category: ["seafood"],
        description: "Fresh, sweet prawns caught from local waters. Perfect for barbecues, pasta, and seafood platters. Limited seasonal availability.",
        pricePerUnit: 35.50,
        unit: "kg",
        minimumOrderQuantity: 500,
        minimumOrderUnit: "g",
        availabilityWindows: [{ startMonth: 9, endMonth: 11 }, { startMonth: 0, endMonth: 3 }],
        images: ["prawns1.jpg", "prawns2.jpg"],
        createdAt: "2024-01-25T06:30:00Z"
      },
      {
        id: "12",
        name: "Mud Crab",
        category: ["seafood"],
        description: "Premium mud crab with sweet, tender meat. A Queensland delicacy perfect for special occasions and seafood lovers.",
        pricePerUnit: 45.00,
        unit: "kg",
        minimumOrderQuantity: 500,
        minimumOrderUnit: "g",
        availabilityWindows: [{ startMonth: 8, endMonth: 11 }, { startMonth: 0, endMonth: 4 }],
        images: ["mud_crab1.jpg", "mud_crab2.jpg"],
        createdAt: "2024-01-25T06:30:00Z"
      }
    ]
  },
  {
    farmId: "farm-5",
    name: "Mountain View Dairy",
    description: "Free-range dairy and poultry products from happy, healthy animals. Our farm overlooks the beautiful Granite Belt region with pristine mountain air and clean pastures.",
    address: {
      street: "654 Mountain Road",
      city: "Stanthorpe",
      state: "QLD",
      zipCode: "4380"
    },
    contact_email: "contact@mountainviewdairy.com.au",
    contact_phone: "+61746789012",
    opening_hours: "Daily: 6AM-8PM",
    ownerId: "user-5",
    createdAt: "2024-01-18T07:20:00Z",
    produce: [
      {
        id: "13",
        name: "Farm Fresh Eggs",
        category: ["eggsAndMilk"],
        description: "Free-range eggs from happy hens with bright orange yolks. Our chickens roam freely on pasture for the best quality eggs.",
        pricePerUnit: 8.50,
        unit: "dozen",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "dozen",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["farm_eggs1.jpg", "farm_eggs2.jpg"],
        createdAt: "2024-01-18T07:20:00Z"
      },
      {
        id: "14",
        name: "Raw Milk",
        category: ["eggsAndMilk"],
        description: "Fresh, unpasteurized milk from grass-fed cows. Rich, creamy texture with natural enzymes and nutrients intact.",
        pricePerUnit: 4.25,
        unit: "L",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "L",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["raw_milk1.jpg", "raw_milk2.jpg"],
        createdAt: "2024-01-18T07:20:00Z"
      },
      {
        id: "15",
        name: "Artisan Cheese",
        category: ["eggsAndMilk"],
        description: "Handcrafted artisan cheese made from our premium milk. Aged to perfection with complex flavors and smooth texture.",
        pricePerUnit: 22.75,
        unit: "wheel",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "wheel",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["artisan_cheese1.jpg", "artisan_cheese2.jpg"],
        createdAt: "2024-01-18T07:20:00Z"
      }
    ]
  },
  {
    farmId: "farm-6",
    name: "Moringa Farm Australia",
    description: "Organic produce farm specializing in superfoods and vegetables. We focus on nutrient-dense crops that promote health and wellbeing through natural farming practices.",
    address: {
      street: "987 Superfood Avenue",
      city: "Stratford",
      state: "QLD",
      zipCode: "4870"
    },
    contact_email: "info@moringafarmaus.com.au",
    contact_phone: "+61740555789",
    opening_hours: "Mon-Fri: 8AM-5PM, Sat: 8AM-2PM",
    ownerId: "user-6",
    createdAt: "2024-02-05T10:15:00Z",
    produce: [
      {
        id: "16",
        name: "Honey",
        category: ["honey"],
        description: "Pure, raw honey from our on-farm apiaries. Rich in antioxidants and natural enzymes with a distinct floral taste from native Australian flowers.",
        pricePerUnit: 4.92,
        unit: "jar",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "jar",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["honey_jar1.jpg", "honey_jar2.jpg"],
        createdAt: "2024-02-05T10:15:00Z"
      },
      {
        id: "17",
        name: "Sweet Potatoes",
        category: ["vegetables"],
        description: "Organic sweet potatoes rich in vitamins and minerals. Perfect for roasting, baking, or making healthy fries. Natural sweetness and vibrant orange color.",
        pricePerUnit: 12.50,
        unit: "kg",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 1, endMonth: 7 }],
        images: ["sweet_potatoes1.jpg", "sweet_potatoes2.jpg"],
        createdAt: "2024-02-05T10:15:00Z"
      },
      {
        id: "18",
        name: "Kale",
        category: ["vegetables"],
        description: "Nutrient-dense kale leaves packed with vitamins A, C, and K. Perfect for salads, smoothies, and healthy cooking. Crisp texture and mild flavor.",
        pricePerUnit: 8.75,
        unit: "bunch",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "bunch",
        availabilityWindows: [{ startMonth: 3, endMonth: 8 }],
        images: ["kale1.jpg", "kale2.jpg"],
        createdAt: "2024-02-05T10:15:00Z"
      }
    ]
  },
  {
    farmId: "farm-7",
    name: "Nutty Hills Farm",
    description: "Premium nuts, seeds and coffee beans grown in the fertile Byron Bay hinterland. Our farm combines traditional methods with modern sustainable practices.",
    address: {
      street: "135 Hinterland Road",
      city: "Byron Bay",
      state: "NSW",
      zipCode: "2481"
    },
    contact_email: "sales@nuttyhills.com.au",
    contact_phone: "+61266543210",
    opening_hours: "Mon-Fri: 9AM-5PM",
    ownerId: "user-7",
    createdAt: "2024-01-30T11:00:00Z",
    produce: [
      {
        id: "19",
        name: "Macadamia Nuts",
        category: ["nutsSeeds"],
        description: "Premium Australian macadamia nuts with rich, buttery flavor. Hand-harvested and naturally processed for the finest quality and taste.",
        pricePerUnit: 35.99,
        unit: "kg",
        minimumOrderQuantity: 500,
        minimumOrderUnit: "g",
        availabilityWindows: [{ startMonth: 1, endMonth: 5 }],
        images: ["macadamia1.jpg", "macadamia2.jpg"],
        createdAt: "2024-01-30T11:00:00Z"
      },
      {
        id: "20",
        name: "Coffee Beans",
        category: ["coffeeAndTea"],
        description: "Single-origin coffee beans grown at high altitude for exceptional flavor. Carefully roasted to bring out complex notes and aroma.",
        pricePerUnit: 24.50,
        unit: "kg",
        minimumOrderQuantity: 250,
        minimumOrderUnit: "g",
        availabilityWindows: [{ startMonth: 3, endMonth: 9 }],
        images: ["coffee_beans1.jpg", "coffee_beans2.jpg"],
        createdAt: "2024-01-30T11:00:00Z"
      },
      {
        id: "21",
        name: "Chia Seeds",
        category: ["nutsSeeds"],
        description: "Organic chia seeds packed with omega-3 fatty acids and fiber. Perfect for smoothies, puddings, and healthy baking.",
        pricePerUnit: 18.75,
        unit: "kg",
        minimumOrderQuantity: 250,
        minimumOrderUnit: "g",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["chia_seeds1.jpg", "chia_seeds2.jpg"],
        createdAt: "2024-01-30T11:00:00Z"
      }
    ]
  },
  {
    farmId: "farm-8",
    name: "Cattle Creek Ranch",
    description: "Grass-fed beef and lamb from ethical farming practices. Our animals graze on open pastures in the Queensland outback, ensuring the highest quality meat.",
    address: {
      street: "2468 Ranch Road",
      city: "Roma",
      state: "QLD",
      zipCode: "4455"
    },
    contact_email: "orders@cattlecreekranch.com.au",
    contact_phone: "+61746234567",
    opening_hours: "By appointment",
    ownerId: "user-8",
    createdAt: "2024-01-12T14:30:00Z",
    produce: [
      {
        id: "22",
        name: "Grass-Fed Beef",
        category: ["livestock"],
        description: "Premium grass-fed beef from cattle raised on natural pastures. Lean, flavorful meat with superior nutritional profile and ethical sourcing.",
        pricePerUnit: 28.99,
        unit: "kg",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "kg",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["grass_fed_beef1.jpg", "grass_fed_beef2.jpg"],
        createdAt: "2024-01-12T14:30:00Z"
      },
      {
        id: "23",
        name: "Lamb Chops",
        category: ["livestock"],
        description: "Tender lamb chops from free-range sheep. Perfect for grilling or roasting, with exceptional flavor and tenderness.",
        pricePerUnit: 32.50,
        unit: "kg",
        minimumOrderQuantity: 500,
        minimumOrderUnit: "g",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["lamb_chops1.jpg", "lamb_chops2.jpg"],
        createdAt: "2024-01-12T14:30:00Z"
      },
      {
        id: "24",
        name: "Beef Mince",
        category: ["livestock"],
        description: "High-quality beef mince from grass-fed cattle. Perfect for burgers, meatballs, and family meals. Lean and flavorful.",
        pricePerUnit: 18.99,
        unit: "kg",
        minimumOrderQuantity: 500,
        minimumOrderUnit: "g",
        availabilityWindows: [{ startMonth: 0, endMonth: 11 }],
        images: ["beef_mince1.jpg", "beef_mince2.jpg"],
        createdAt: "2024-01-12T14:30:00Z"
      }
    ]
  }
];

export async function GET(request: NextRequest): Promise<NextResponse<FarmsApiResponse>> {
  const { searchParams } = new URL(request.url);
  
  // Extract query parameters
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const distance = parseInt(searchParams.get('distance') || '50');
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  
  // Filter farms based on search criteria
  let filteredFarms = allFarms;
  
  // Text search in farm name, description, or produce names
  if (query) {
    filteredFarms = filteredFarms.filter(farm => 
      farm.name.toLowerCase().includes(query.toLowerCase()) ||
      farm.description.toLowerCase().includes(query.toLowerCase()) ||
      farm.produce.some(produce => 
        produce.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }
  
  // Category filtering - only filter if specific categories are requested
  // If no categories provided, show all (default behavior)
  if (categories.length > 0) {
    filteredFarms = filteredFarms.filter(farm =>
      farm.produce.some(produce => 
        produce.category.some(cat => categories.includes(cat))
      )
    );
  }
  // If categories array is empty, don't filter by category (show all)
  
  // Distance filtering (simplified - in real app would use geolocation)
  // For demo, we'll just randomly filter some farms based on distance
  if (distance < 100) {
    const keepRatio = Math.max(0.3, distance / 100);
    filteredFarms = filteredFarms.slice(0, Math.ceil(filteredFarms.length * keepRatio));
  }
  
  // Pagination
  const totalItems = filteredFarms.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedFarms = filteredFarms.slice(startIndex, startIndex + limit);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    success: true,
    data: {
      farms: paginatedFarms,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    }
  });
}