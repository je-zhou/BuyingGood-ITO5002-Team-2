import { NextRequest, NextResponse } from 'next/server';

interface Farm {
  farmId: string;
  name: string;
  description: string;
  address: {
    city: string;
    state: string;
  };
  opening_hours: string;
  produce: Produce[];
}

interface Produce {
  id: string;
  name: string;
  price: number;
  unit: string;
  availability: string;
  category: string;
}

// Extended dummy data with more farms and categories
const allFarms: Farm[] = [
  {
    farmId: "farm-1",
    name: "Green Valley Organic Farm",
    description: "Certified organic farm specializing in fresh vegetables and herbs",
    address: { city: "Brisbane", state: "QLD" },
    opening_hours: "Mon-Fri: 7AM-5PM, Sat-Sun: 8AM-4PM",
    produce: [
      { id: "1", name: "Organic Honey", price: 12.50, unit: "jar", availability: "In Stock", category: "honey" },
      { id: "2", name: "Fresh Tomatoes", price: 8.99, unit: "kg", availability: "In Stock", category: "vegetables" },
      { id: "3", name: "Basil", price: 4.50, unit: "bunch", availability: "Limited", category: "herbsAndSpices" }
    ]
  },
  {
    farmId: "farm-2",
    name: "Sunshine Citrus Grove",
    description: "Premium citrus fruits and seasonal produce",
    address: { city: "Gold Coast", state: "QLD" },
    opening_hours: "Daily: 6AM-6PM",
    produce: [
      { id: "4", name: "Valencia Oranges", price: 6.75, unit: "kg", availability: "In Stock", category: "fruits" },
      { id: "5", name: "Lemons", price: 5.25, unit: "kg", availability: "In Stock", category: "fruits" },
      { id: "6", name: "Limes", price: 7.99, unit: "kg", availability: "Limited", category: "fruits" }
    ]
  },
  {
    farmId: "farm-3",
    name: "Heritage Grain Co",
    description: "Ancient grains and legumes using traditional farming methods",
    address: { city: "Toowoomba", state: "QLD" },
    opening_hours: "Mon-Sat: 8AM-4PM",
    produce: [
      { id: "7", name: "Quinoa", price: 18.50, unit: "kg", availability: "In Stock", category: "grain" },
      { id: "8", name: "Black Beans", price: 12.99, unit: "kg", availability: "In Stock", category: "legumes" },
      { id: "9", name: "Lentils", price: 9.75, unit: "kg", availability: "In Stock", category: "legumes" }
    ]
  },
  {
    farmId: "farm-4",
    name: "Coastal Seafood Farm",
    description: "Sustainable aquaculture and fresh seafood",
    address: { city: "Cairns", state: "QLD" },
    opening_hours: "Tue-Sun: 5AM-2PM",
    produce: [
      { id: "10", name: "Barramundi", price: 28.99, unit: "kg", availability: "In Stock", category: "seafood" },
      { id: "11", name: "Prawns", price: 35.50, unit: "kg", availability: "Limited", category: "seafood" },
      { id: "12", name: "Mud Crab", price: 45.00, unit: "kg", availability: "In Stock", category: "seafood" }
    ]
  },
  {
    farmId: "farm-5",
    name: "Mountain View Dairy",
    description: "Free-range dairy and poultry products",
    address: { city: "Stanthorpe", state: "QLD" },
    opening_hours: "Daily: 6AM-8PM",
    produce: [
      { id: "13", name: "Farm Fresh Eggs", price: 8.50, unit: "dozen", availability: "In Stock", category: "eggsAndMilk" },
      { id: "14", name: "Raw Milk", price: 4.25, unit: "L", availability: "In Stock", category: "eggsAndMilk" },
      { id: "15", name: "Artisan Cheese", price: 22.75, unit: "wheel", availability: "Limited", category: "eggsAndMilk" }
    ]
  },
  {
    farmId: "farm-6",
    name: "Moringa Farm Australia",
    description: "Organic produce farm specializing in superfoods and vegetables",
    address: { city: "Stratford", state: "QLD" },
    opening_hours: "TBD",
    produce: [
      { id: "16", name: "Honey", price: 4.92, unit: "jar", availability: "In Stock", category: "honey" },
      { id: "17", name: "Sweet Potatoes", price: 12.50, unit: "kg", availability: "In Stock", category: "vegetables" },
      { id: "18", name: "Kale", price: 8.75, unit: "bunch", availability: "Limited", category: "vegetables" }
    ]
  },
  {
    farmId: "farm-7",
    name: "Nutty Hills Farm",
    description: "Premium nuts, seeds and coffee beans",
    address: { city: "Byron Bay", state: "NSW" },
    opening_hours: "Mon-Fri: 9AM-5PM",
    produce: [
      { id: "19", name: "Macadamia Nuts", price: 35.99, unit: "kg", availability: "In Stock", category: "nutsSeeds" },
      { id: "20", name: "Coffee Beans", price: 24.50, unit: "kg", availability: "In Stock", category: "coffeeAndTea" },
      { id: "21", name: "Chia Seeds", price: 18.75, unit: "kg", availability: "Limited", category: "nutsSeeds" }
    ]
  },
  {
    farmId: "farm-8",
    name: "Cattle Creek Ranch",
    description: "Grass-fed beef and lamb from ethical farming",
    address: { city: "Roma", state: "QLD" },
    opening_hours: "By appointment",
    produce: [
      { id: "22", name: "Grass-Fed Beef", price: 28.99, unit: "kg", availability: "In Stock", category: "livestock" },
      { id: "23", name: "Lamb Chops", price: 32.50, unit: "kg", availability: "In Stock", category: "livestock" },
      { id: "24", name: "Beef Mince", price: 18.99, unit: "kg", availability: "Limited", category: "livestock" }
    ]
  }
];

export async function GET(request: NextRequest) {
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
        categories.includes(produce.category)
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