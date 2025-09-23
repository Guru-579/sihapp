export interface MarketPrice {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  unit: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  marketStatus?: 'open' | 'closed' | 'limited';
  contactNumber?: string;
  marketDays?: string[];
}

export interface MarketData {
  prices: MarketPrice[];
  lastUpdated: string;
  totalRecords: number;
}

// Andhra Pradesh focused market data - In production, replace with real API
const mockMarketData: MarketPrice[] = [
  // Guntur District
  {
    id: 'ap1',
    commodity: 'Cotton',
    variety: 'Medium Staple',
    market: 'Guntur Mandi',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    minPrice: 5800,
    maxPrice: 6200,
    modalPrice: 6000,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 16.2973,
    longitude: 80.4370,
    marketStatus: 'open',
    contactNumber: '+91-863-2345678',
    marketDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    id: 'ap2',
    commodity: 'Chilli',
    variety: 'Red Hot',
    market: 'Guntur Mirchi Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    minPrice: 8500,
    maxPrice: 9200,
    modalPrice: 8850,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 16.2973,
    longitude: 80.4370,
    marketStatus: 'open',
    contactNumber: '+91-863-2345679',
    marketDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  // Krishna District
  {
    id: 'ap3',
    commodity: 'Rice',
    variety: 'BPT 5204',
    market: 'Vijayawada Mandi',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    minPrice: 2800,
    maxPrice: 3200,
    modalPrice: 3000,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 16.5062,
    longitude: 80.6480,
    marketStatus: 'open',
    contactNumber: '+91-866-2345678',
    marketDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    id: 'ap4',
    commodity: 'Sugarcane',
    variety: 'Co-86032',
    market: 'Machilipatnam Mandi',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    minPrice: 280,
    maxPrice: 320,
    modalPrice: 300,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 16.1875,
    longitude: 81.1389,
    marketStatus: 'open',
    contactNumber: '+91-8672-234567',
    marketDays: ['Tuesday', 'Thursday', 'Saturday']
  },
  // West Godavari District
  {
    id: 'ap5',
    commodity: 'Coconut',
    variety: 'Tall Variety',
    market: 'Eluru Mandi',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    minPrice: 12000,
    maxPrice: 15000,
    modalPrice: 13500,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Thousand Nuts',
    latitude: 16.7107,
    longitude: 81.0952,
    marketStatus: 'open',
    contactNumber: '+91-8812-234567',
    marketDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
  },
  {
    id: 'ap6',
    commodity: 'Turmeric',
    variety: 'Salem',
    market: 'Bhimavaram Mandi',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    minPrice: 7500,
    maxPrice: 8200,
    modalPrice: 7850,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 16.5449,
    longitude: 81.5212,
    marketStatus: 'open',
    contactNumber: '+91-8816-234567',
    marketDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  // East Godavari District
  {
    id: 'ap7',
    commodity: 'Banana',
    variety: 'Robusta',
    market: 'Kakinada Mandi',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    minPrice: 800,
    maxPrice: 1200,
    modalPrice: 1000,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Dozen',
    latitude: 16.9891,
    longitude: 82.2475,
    marketStatus: 'open',
    contactNumber: '+91-884-2345678',
    marketDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  // Visakhapatnam District
  {
    id: 'ap8',
    commodity: 'Cashew',
    variety: 'Raw',
    market: 'Visakhapatnam Mandi',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    minPrice: 18000,
    maxPrice: 22000,
    modalPrice: 20000,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 17.6868,
    longitude: 83.2185,
    marketStatus: 'open',
    contactNumber: '+91-891-2345678',
    marketDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  // Prakasam District
  {
    id: 'ap9',
    commodity: 'Groundnut',
    variety: 'Bold',
    market: 'Ongole Mandi',
    district: 'Prakasam',
    state: 'Andhra Pradesh',
    minPrice: 5200,
    maxPrice: 5800,
    modalPrice: 5500,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 15.5057,
    longitude: 80.0499,
    marketStatus: 'open',
    contactNumber: '+91-8592-234567',
    marketDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
  },
  // Nellore District
  {
    id: 'ap10',
    commodity: 'Tomato',
    variety: 'Hybrid',
    market: 'Nellore Mandi',
    district: 'Nellore',
    state: 'Andhra Pradesh',
    minPrice: 1200,
    maxPrice: 1800,
    modalPrice: 1500,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 14.4426,
    longitude: 79.9865,
    marketStatus: 'open',
    contactNumber: '+91-861-2345678',
    marketDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  // Kadapa District
  {
    id: 'ap11',
    commodity: 'Onion',
    variety: 'Red',
    market: 'Kadapa Mandi',
    district: 'Kadapa',
    state: 'Andhra Pradesh',
    minPrice: 800,
    maxPrice: 1200,
    modalPrice: 1000,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 14.4673,
    longitude: 78.8242,
    marketStatus: 'open',
    contactNumber: '+91-8562-234567',
    marketDays: ['Monday', 'Wednesday', 'Friday']
  },
  // Kurnool District
  {
    id: 'ap12',
    commodity: 'Maize',
    variety: 'Hybrid',
    market: 'Kurnool Mandi',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    minPrice: 1800,
    maxPrice: 2200,
    modalPrice: 2000,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 15.8281,
    longitude: 78.0373,
    marketStatus: 'open',
    contactNumber: '+91-8518-234567',
    marketDays: ['Tuesday', 'Thursday', 'Saturday']
  },
  // Anantapur District
  {
    id: 'ap13',
    commodity: 'Sunflower',
    variety: 'Hybrid',
    market: 'Anantapur Mandi',
    district: 'Anantapur',
    state: 'Andhra Pradesh',
    minPrice: 4200,
    maxPrice: 4800,
    modalPrice: 4500,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 14.6819,
    longitude: 77.6006,
    marketStatus: 'open',
    contactNumber: '+91-8554-234567',
    marketDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
  },
  // Chittoor District
  {
    id: 'ap14',
    commodity: 'Mango',
    variety: 'Alphonso',
    market: 'Chittoor Mandi',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    minPrice: 3500,
    maxPrice: 4500,
    modalPrice: 4000,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 13.2172,
    longitude: 79.1003,
    marketStatus: 'open',
    contactNumber: '+91-8572-234567',
    marketDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  // Srikakulam District
  {
    id: 'ap15',
    commodity: 'Black Gram',
    variety: 'Local',
    market: 'Srikakulam Mandi',
    district: 'Srikakulam',
    state: 'Andhra Pradesh',
    minPrice: 6500,
    maxPrice: 7200,
    modalPrice: 6850,
    priceDate: new Date().toISOString().split('T')[0],
    unit: 'Quintal',
    latitude: 18.2949,
    longitude: 83.8977,
    marketStatus: 'open',
    contactNumber: '+91-8942-234567',
    marketDays: ['Tuesday', 'Thursday', 'Saturday']
  }
];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Get nearest markets based on user location
export const getNearestMarkets = async (
  userLatitude: number, 
  userLongitude: number, 
  maxDistance: number = 100
): Promise<MarketPrice[]> => {
  try {
    // Calculate distances for all markets
    const marketsWithDistance = mockMarketData.map(market => ({
      ...market,
      distance: market.latitude && market.longitude 
        ? calculateDistance(userLatitude, userLongitude, market.latitude, market.longitude)
        : Infinity
    }));

    // Filter by distance and sort by nearest first
    const nearbyMarkets = marketsWithDistance
      .filter(market => market.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    return nearbyMarkets;
  } catch (error) {
    console.error('Error getting nearest markets:', error);
    return [];
  }
};

// Get market prices for a specific commodity
export const getMarketPrices = async (commodity?: string, district?: string): Promise<MarketData> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let filteredData = mockMarketData;

    // Filter by commodity if provided
    if (commodity && commodity !== '') {
      filteredData = filteredData.filter(price => 
        price.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    }

    // Filter by district if provided
    if (district && district !== '') {
      filteredData = filteredData.filter(price => 
        price.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    return {
      prices: filteredData,
      lastUpdated: new Date().toISOString(),
      totalRecords: filteredData.length
    };
  } catch (error) {
    console.error('Error fetching market prices:', error);
    throw new Error('Failed to fetch market prices');
  }
};

// Get all available commodities
export const getAvailableCommodities = (): string[] => {
  return [...new Set(mockMarketData.map(price => price.commodity))];
};

// Get all available districts
export const getAvailableDistricts = (): string[] => {
  return [...new Set(mockMarketData.map(price => price.district))];
};

// Get nearby markets (mock implementation)
export const getNearbyMarkets = async (latitude?: number, longitude?: number) => {
  try {
    // Mock nearby markets data
    const nearbyMarkets = [
      {
        id: '1',
        name: 'Central Mandi',
        distance: 2.5,
        address: 'Sector 26, Market Road',
        isOpen: true,
        openingHours: '6:00 AM - 6:00 PM'
      },
      {
        id: '2',
        name: 'Vegetable Market',
        distance: 4.2,
        address: 'Main Bazaar, City Center',
        isOpen: true,
        openingHours: '5:00 AM - 8:00 PM'
      },
      {
        id: '3',
        name: 'Grain Market',
        distance: 6.8,
        address: 'Industrial Area, Phase 2',
        isOpen: false,
        openingHours: '7:00 AM - 5:00 PM'
      }
    ];

    return nearbyMarkets;
  } catch (error) {
    console.error('Error fetching nearby markets:', error);
    throw new Error('Failed to fetch nearby markets');
  }
};

// Get price trends for a commodity (mock implementation)
export const getPriceTrends = async (commodity: string, days: number = 30) => {
  try {
    // Generate mock price trend data
    const trends = [];
    const basePrice = mockMarketData.find(p => p.commodity === commodity)?.modalPrice || 1000;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some random variation to the price
      const variation = (Math.random() - 0.5) * 200;
      const price = Math.max(basePrice + variation, basePrice * 0.8);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price),
        volume: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    return trends;
  } catch (error) {
    console.error('Error fetching price trends:', error);
    throw new Error('Failed to fetch price trends');
  }
};

// Format price for display
export const formatPrice = (price: number, unit: string = 'Quintal'): string => {
  return `₹${price.toLocaleString('en-IN')}/${unit}`;
};

// Calculate price change percentage
export const calculatePriceChange = (currentPrice: number, previousPrice: number): number => {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
};
