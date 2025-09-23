import { SoilHealthData } from './ocrService';

export interface CropRecommendation {
  name: string;
  suitability: 'excellent' | 'good' | 'moderate' | 'poor';
  reason: string;
  expectedYield: string;
  season: string;
  waterRequirement: 'low' | 'medium' | 'high';
  marketDemand: 'high' | 'medium' | 'low';
  profitability: number; // 1-10 scale
}

export interface LocationBasedRecommendation {
  region: string;
  climate: string;
  recommendedCrops: CropRecommendation[];
  seasonalAdvice: string;
  localMarketInfo: string;
}

export interface EnhancedSoilAnalysis {
  soilHealth: SoilHealthData;
  cropRecommendations: CropRecommendation[];
  locationRecommendations: LocationBasedRecommendation;
  fertilizerAdvice: {
    primary: string[];
    secondary: string[];
    organic: string[];
    timing: string;
    quantity: string;
  };
  irrigationAdvice: {
    method: string;
    frequency: string;
    timing: string;
    waterQuality: string;
  };
  soilImprovement: {
    shortTerm: string[];
    longTerm: string[];
    organicMatter: string;
    phAdjustment: string;
  };
}

// Crop database with soil requirements
const CROP_DATABASE = {
  rice: {
    name: 'Rice',
    phRange: [5.5, 7.0],
    nRequirement: 'high',
    pRequirement: 'medium',
    kRequirement: 'medium',
    organicCarbonMin: 0.5,
    waterRequirement: 'high',
    season: 'Kharif',
    profitability: 7
  },
  wheat: {
    name: 'Wheat',
    phRange: [6.0, 7.5],
    nRequirement: 'high',
    pRequirement: 'medium',
    kRequirement: 'medium',
    organicCarbonMin: 0.6,
    waterRequirement: 'medium',
    season: 'Rabi',
    profitability: 8
  },
  cotton: {
    name: 'Cotton',
    phRange: [6.0, 8.0],
    nRequirement: 'high',
    pRequirement: 'high',
    kRequirement: 'high',
    organicCarbonMin: 0.7,
    waterRequirement: 'high',
    season: 'Kharif',
    profitability: 9
  },
  sugarcane: {
    name: 'Sugarcane',
    phRange: [6.5, 7.5],
    nRequirement: 'very_high',
    pRequirement: 'high',
    kRequirement: 'high',
    organicCarbonMin: 0.8,
    waterRequirement: 'very_high',
    season: 'Annual',
    profitability: 8
  },
  maize: {
    name: 'Maize',
    phRange: [6.0, 7.0],
    nRequirement: 'high',
    pRequirement: 'medium',
    kRequirement: 'medium',
    organicCarbonMin: 0.5,
    waterRequirement: 'medium',
    season: 'Kharif/Rabi',
    profitability: 7
  },
  tomato: {
    name: 'Tomato',
    phRange: [6.0, 7.0],
    nRequirement: 'medium',
    pRequirement: 'high',
    kRequirement: 'high',
    organicCarbonMin: 1.0,
    waterRequirement: 'high',
    season: 'Rabi',
    profitability: 9
  },
  onion: {
    name: 'Onion',
    phRange: [6.0, 7.5],
    nRequirement: 'medium',
    pRequirement: 'medium',
    kRequirement: 'high',
    organicCarbonMin: 0.8,
    waterRequirement: 'medium',
    season: 'Rabi',
    profitability: 8
  },
  potato: {
    name: 'Potato',
    phRange: [5.0, 6.5],
    nRequirement: 'high',
    pRequirement: 'high',
    kRequirement: 'very_high',
    organicCarbonMin: 1.2,
    waterRequirement: 'medium',
    season: 'Rabi',
    profitability: 8
  }
};

// Regional crop preferences
const REGIONAL_PREFERENCES = {
  'north': ['wheat', 'rice', 'potato', 'sugarcane'],
  'south': ['rice', 'cotton', 'tomato', 'onion'],
  'west': ['cotton', 'sugarcane', 'onion', 'tomato'],
  'east': ['rice', 'maize', 'potato', 'wheat'],
  'central': ['wheat', 'maize', 'cotton', 'sugarcane']
};

export const generateCropRecommendations = (
  soilData: SoilHealthData,
  location?: { latitude: number; longitude: number }
): CropRecommendation[] => {
  const recommendations: CropRecommendation[] = [];

  Object.entries(CROP_DATABASE).forEach(([key, crop]) => {
    const suitability = calculateCropSuitability(soilData, crop);
    const marketDemand = getMarketDemand(crop.name);
    
    recommendations.push({
      name: crop.name,
      suitability: suitability.level,
      reason: suitability.reason,
      expectedYield: calculateExpectedYield(crop, suitability.score),
      season: crop.season,
      waterRequirement: crop.waterRequirement as 'low' | 'medium' | 'high',
      marketDemand,
      profitability: crop.profitability
    });
  });

  // Sort by suitability and profitability
  return recommendations.sort((a, b) => {
    const suitabilityOrder = { excellent: 4, good: 3, moderate: 2, poor: 1 };
    const aScore = suitabilityOrder[a.suitability] * a.profitability;
    const bScore = suitabilityOrder[b.suitability] * b.profitability;
    return bScore - aScore;
  });
};

const calculateCropSuitability = (soilData: SoilHealthData, crop: any) => {
  let score = 0;
  const reasons = [];

  // pH suitability
  if (soilData.pH && soilData.pH >= crop.phRange[0] && soilData.pH <= crop.phRange[1]) {
    score += 25;
    reasons.push('Optimal pH range');
  } else if (soilData.pH && Math.abs(soilData.pH - (crop.phRange[0] + crop.phRange[1]) / 2) <= 0.5) {
    score += 15;
    reasons.push('Acceptable pH range');
  } else {
    reasons.push('pH adjustment needed');
  }

  const ph = parseFloat(soilData.pH?.toString() || '7.0');
  const nitrogen = parseFloat(soilData.nitrogen?.toString() || '0');
  const phosphorus = parseFloat(soilData.phosphorus?.toString() || '0');
  const potassium = parseFloat(soilData.potassium?.toString() || '0');

  // Nutrient suitability
  const nLevel = getNutrientLevel(nitrogen);
  const pLevel = getNutrientLevel(phosphorus);
  const kLevel = getNutrientLevel(potassium);

  if (matchesRequirement(nLevel, crop.nRequirement)) {
    score += 25;
    reasons.push('Good nitrogen levels');
  } else {
    reasons.push('Nitrogen supplementation needed');
  }

  if (matchesRequirement(pLevel, crop.pRequirement)) {
    score += 25;
    reasons.push('Good phosphorus levels');
  } else {
    reasons.push('Phosphorus supplementation needed');
  }

  if (matchesRequirement(kLevel, crop.kRequirement)) {
    score += 25;
    reasons.push('Good potassium levels');
  } else {
    reasons.push('Potassium supplementation needed');
  }

  // Organic carbon
  const organicCarbon = soilData.organicCarbon || 0.5;
  if (organicCarbon >= crop.organicCarbonMin) {
    reasons.push('Adequate organic matter');
  } else {
    reasons.push('Organic matter improvement needed');
  }

  let level: 'excellent' | 'good' | 'moderate' | 'poor';
  if (score >= 80) level = 'excellent';
  else if (score >= 60) level = 'good';
  else if (score >= 40) level = 'moderate';
  else level = 'poor';

  return {
    score,
    level,
    reason: reasons.slice(0, 2).join(', ')
  };
};

const getNutrientLevel = (value: number): string => {
  if (value >= 300) return 'high';
  if (value >= 150) return 'medium';
  return 'low';
};

const matchesRequirement = (level: string, requirement: string): boolean => {
  const levelOrder = { low: 1, medium: 2, high: 3, very_high: 4 };
  const reqOrder = { low: 1, medium: 2, high: 3, very_high: 4 };
  
  return levelOrder[level] >= reqOrder[requirement];
};

const getMarketDemand = (cropName: string): 'high' | 'medium' | 'low' => {
  const highDemandCrops = ['tomato', 'onion', 'potato', 'cotton'];
  const mediumDemandCrops = ['wheat', 'rice', 'maize'];
  
  if (highDemandCrops.includes(cropName.toLowerCase())) return 'high';
  if (mediumDemandCrops.includes(cropName.toLowerCase())) return 'medium';
  return 'low';
};

const calculateExpectedYield = (crop: any, suitabilityScore: number): string => {
  const baseYields = {
    'Rice': '4-6 tons/hectare',
    'Wheat': '3-5 tons/hectare',
    'Cotton': '15-20 quintals/hectare',
    'Sugarcane': '70-90 tons/hectare',
    'Maize': '5-7 tons/hectare',
    'Tomato': '25-35 tons/hectare',
    'Onion': '20-30 tons/hectare',
    'Potato': '20-25 tons/hectare'
  };

  const baseYield = baseYields[crop.name] || '3-5 tons/hectare';
  
  if (suitabilityScore >= 80) return `High: ${baseYield}`;
  if (suitabilityScore >= 60) return `Good: ${baseYield}`;
  if (suitabilityScore >= 40) return `Moderate: ${baseYield}`;
  return `Low: ${baseYield}`;
};

export const generateLocationBasedRecommendations = async (
  soilData: SoilHealthData,
  location?: { latitude: number; longitude: number }
): Promise<LocationBasedRecommendation> => {
  // Determine region based on location (simplified)
  let region = 'central';
  if (location) {
    if (location.latitude > 28) region = 'north';
    else if (location.latitude < 15) region = 'south';
    else if (location.longitude < 77) region = 'west';
    else if (location.longitude > 88) region = 'east';
  }

  const preferredCrops = REGIONAL_PREFERENCES[region] || REGIONAL_PREFERENCES.central;
  const cropRecommendations = generateCropRecommendations(soilData, location);
  
  // Filter recommendations based on regional preferences
  const regionalCrops = cropRecommendations.filter(crop => 
    preferredCrops.includes(crop.name.toLowerCase())
  );

  return {
    region: region.charAt(0).toUpperCase() + region.slice(1),
    climate: getClimateInfo(region),
    recommendedCrops: regionalCrops.slice(0, 4),
    seasonalAdvice: getSeasonalAdvice(region),
    localMarketInfo: getLocalMarketInfo(region)
  };
};

const getClimateInfo = (region: string): string => {
  const climateMap = {
    north: 'Temperate with cold winters and hot summers',
    south: 'Tropical with high humidity and moderate temperatures',
    west: 'Semi-arid with low rainfall and high temperatures',
    east: 'Humid subtropical with high rainfall',
    central: 'Semi-arid to humid with moderate rainfall'
  };
  return climateMap[region] || climateMap.central;
};

const getSeasonalAdvice = (region: string): string => {
  const adviceMap = {
    north: 'Focus on Rabi crops in winter and Kharif crops in monsoon',
    south: 'Year-round cultivation possible with proper irrigation',
    west: 'Drought-resistant crops recommended, focus on water conservation',
    east: 'Excellent for rice cultivation, manage excess water during monsoon',
    central: 'Balanced approach with both Kharif and Rabi crops'
  };
  return adviceMap[region] || adviceMap.central;
};

const getLocalMarketInfo = (region: string): string => {
  const marketMap = {
    north: 'Strong demand for wheat, rice, and vegetables in nearby urban centers',
    south: 'Good export opportunities for cotton and spices',
    west: 'High demand for cash crops like cotton and sugarcane',
    east: 'Rice and fish farming have good local market demand',
    central: 'Diverse market opportunities for both food and cash crops'
  };
  return marketMap[region] || marketMap.central;
};

export const generateEnhancedSoilAnalysis = async (
  soilData: SoilHealthData,
  location?: { latitude: number; longitude: number }
): Promise<EnhancedSoilAnalysis> => {
  const cropRecommendations = generateCropRecommendations(soilData, location);
  const getLocationData = (location: { latitude: number; longitude: number } | null) => {
    return location ? generateLocationBasedRecommendations(soilData, location) : null;
  };

  const locationRecommendations = await getLocationData(location);

  return {
    soilHealth: soilData,
    cropRecommendations: cropRecommendations.slice(0, 6),
    locationRecommendations,
    fertilizerAdvice: generateFertilizerAdvice(soilData),
    irrigationAdvice: generateIrrigationAdvice(soilData),
    soilImprovement: generateSoilImprovementPlan(soilData)
  };
};

const generateFertilizerAdvice = (soilData: SoilHealthData) => {
  const advice = {
    primary: [],
    secondary: [],
    organic: [],
    timing: '',
    quantity: ''
  };

  // Primary nutrients
  if (parseFloat(soilData.nitrogen?.toString() || '0') < 280) {
    advice.primary.push('Urea (46% N) - 100-150 kg/hectare');
  }
  if (parseFloat(soilData.phosphorus?.toString() || '0') < 11) {
    advice.primary.push('DAP (18-46-0) - 50-75 kg/hectare');
  }
  if (parseFloat(soilData.potassium?.toString() || '0') < 120) {
    advice.primary.push('MOP (60% K2O) - 50-100 kg/hectare');
  }

  // Secondary nutrients
  if (soilData.pH && soilData.pH < 6.0) {
    advice.secondary.push('Lime - 200-500 kg/hectare');
  }
  advice.secondary.push('Gypsum - 250-500 kg/hectare for sulfur');

  // Organic recommendations
  advice.organic.push('Farm Yard Manure - 5-10 tons/hectare');
  advice.organic.push('Compost - 2-5 tons/hectare');
  if (soilData.organicCarbon < 0.5) {
    advice.organic.push('Green manure crops before main crop');
  }

  advice.timing = 'Apply organic manure 2-3 weeks before sowing. Apply chemical fertilizers in 2-3 splits.';
  advice.quantity = 'Adjust quantities based on soil test results and crop requirements.';

  return advice;
};

const generateIrrigationAdvice = (soilData: SoilHealthData) => {
  return {
    method: soilData.organicCarbon > 0.8 ? 'Drip irrigation recommended' : 'Furrow irrigation suitable',
    frequency: 'Every 7-10 days depending on crop and weather',
    timing: 'Early morning (6-8 AM) or evening (4-6 PM)',
    waterQuality: 'Use water with EC < 2.0 dS/m for best results'
  };
};

const generateSoilImprovementPlan = (soilData: SoilHealthData) => {
  const plan = {
    shortTerm: [],
    longTerm: [],
    organicMatter: '',
    phAdjustment: ''
  };

  // Short-term improvements
  if (soilData.organicCarbon < 0.5) {
    plan.shortTerm.push('Add compost or well-decomposed FYM');
  }
  const ph = soilData.pH || 7.0;
  if (ph < 6.0 || ph > 8.0) {
    plan.shortTerm.push('Apply soil amendments for pH correction');
  }
  plan.shortTerm.push('Ensure proper drainage and aeration');

  // Long-term improvements
  plan.longTerm.push('Implement crop rotation with legumes');
  plan.longTerm.push('Practice conservation tillage');
  plan.longTerm.push('Maintain permanent soil cover');
  plan.longTerm.push('Regular soil testing every 2-3 years');

  // Organic matter improvement
  if (soilData.organicCarbon < 0.5) {
    plan.organicMatter = 'Critical: Increase organic matter through regular compost application';
  } else if (soilData.organicCarbon < 0.75) {
    plan.organicMatter = 'Good: Maintain current organic matter levels';
  } else {
    plan.organicMatter = 'Excellent: Continue current organic matter management';
  }

  // pH adjustment
  if (soilData.pH && soilData.pH < 6.0) {
    plan.shortTerm.push('Apply lime to increase pH');
  } else if (soilData.pH && soilData.pH > 8.0) {
    plan.phAdjustment = 'Apply gypsum or sulfur to reduce pH';
  } else {
    plan.phAdjustment = 'pH is in optimal range, maintain current levels';
  }

  return plan;
};
