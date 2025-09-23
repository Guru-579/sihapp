import { SoilHealthData } from './ocrService';

export interface FertilizerRecommendation {
  category: string;
  issue: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface FertilizerAnalysis {
  overall_status: 'good' | 'fair' | 'poor';
  recommendations: FertilizerRecommendation[];
  summary: string;
}

// Fertilizer recommendation rules
const analyzeNutrientLevel = (level: string | null): 'low' | 'medium' | 'high' | 'unknown' => {
  if (!level) return 'unknown';
  
  const lowerLevel = level.toLowerCase();
  
  if (lowerLevel.includes('low') || lowerLevel.includes('deficient') || lowerLevel.includes('poor')) {
    return 'low';
  } else if (lowerLevel.includes('high') || lowerLevel.includes('excess') || lowerLevel.includes('rich')) {
    return 'high';
  } else if (lowerLevel.includes('medium') || lowerLevel.includes('moderate') || lowerLevel.includes('adequate')) {
    return 'medium';
  }
  
  return 'unknown';
};

export const generateFertilizerRecommendations = (soilData: SoilHealthData): FertilizerAnalysis => {
  const recommendations: FertilizerRecommendation[] = [];
  let overallStatus: 'good' | 'fair' | 'poor' = 'good';
  let issueCount = 0;

  // pH Analysis
  if (soilData.pH !== null) {
    if (soilData.pH < 6.0) {
      recommendations.push({
        category: 'pH Management',
        issue: `Soil is acidic (pH: ${soilData.pH})`,
        recommendation: 'Apply lime (2-3 kg per 100 sq.m) to increase pH. Use dolomitic lime for Mg deficiency.',
        priority: 'high',
        icon: '🧪'
      });
      issueCount++;
    } else if (soilData.pH > 8.0) {
      recommendations.push({
        category: 'pH Management',
        issue: `Soil is alkaline (pH: ${soilData.pH})`,
        recommendation: 'Apply sulfur or organic matter. Use acidifying fertilizers like ammonium sulfate.',
        priority: 'high',
        icon: '🧪'
      });
      issueCount++;
    } else {
      recommendations.push({
        category: 'pH Management',
        issue: `pH is optimal (${soilData.pH})`,
        recommendation: 'Maintain current pH levels with balanced fertilization.',
        priority: 'low',
        icon: '✅'
      });
    }
  }

  // Nitrogen Analysis
  const nitrogenLevel = analyzeNutrientLevel(soilData.nitrogen);
  if (nitrogenLevel === 'low') {
    recommendations.push({
      category: 'Nitrogen',
      issue: 'Nitrogen deficiency detected',
      recommendation: 'Apply Urea (46-0-0) at 2-3 kg per 100 sq.m or use organic sources like compost.',
      priority: 'high',
      icon: '🌱'
    });
    issueCount++;
  } else if (nitrogenLevel === 'high') {
    recommendations.push({
      category: 'Nitrogen',
      issue: 'Excess nitrogen detected',
      recommendation: 'Reduce nitrogen fertilizers. Focus on phosphorus and potassium for balanced growth.',
      priority: 'medium',
      icon: '⚠️'
    });
  }

  // Phosphorus Analysis
  const phosphorusLevel = analyzeNutrientLevel(soilData.phosphorus);
  if (phosphorusLevel === 'low') {
    recommendations.push({
      category: 'Phosphorus',
      issue: 'Phosphorus deficiency detected',
      recommendation: 'Apply DAP (18-46-0) at 1-2 kg per 100 sq.m or Single Super Phosphate.',
      priority: 'high',
      icon: '🌾'
    });
    issueCount++;
  }

  // Potassium Analysis
  const potassiumLevel = analyzeNutrientLevel(soilData.potassium);
  if (potassiumLevel === 'low') {
    recommendations.push({
      category: 'Potassium',
      issue: 'Potassium deficiency detected',
      recommendation: 'Apply Muriate of Potash (0-0-60) at 1-1.5 kg per 100 sq.m or wood ash.',
      priority: 'high',
      icon: '🍃'
    });
    issueCount++;
  }

  // Organic Carbon Analysis
  if (soilData.organicCarbon !== null) {
    if (soilData.organicCarbon < 0.5) {
      recommendations.push({
        category: 'Organic Matter',
        issue: `Low organic carbon (${soilData.organicCarbon}%)`,
        recommendation: 'Add compost, farmyard manure, or green manure crops. Apply 5-10 tons per hectare.',
        priority: 'medium',
        icon: '🌿'
      });
      issueCount++;
    }
  }

  // EC Analysis
  if (soilData.ec !== null) {
    if (soilData.ec > 2.0) {
      recommendations.push({
        category: 'Salinity',
        issue: `High soil salinity (EC: ${soilData.ec} dS/m)`,
        recommendation: 'Improve drainage, apply gypsum, and use salt-tolerant crops. Leach salts with good quality water.',
        priority: 'high',
        icon: '💧'
      });
      issueCount++;
    }
  }

  // Micronutrient Analysis
  if (analyzeNutrientLevel(soilData.zinc) === 'low') {
    recommendations.push({
      category: 'Micronutrients',
      issue: 'Zinc deficiency detected',
      recommendation: 'Apply Zinc Sulfate at 25 kg per hectare or foliar spray of 0.5% ZnSO4.',
      priority: 'medium',
      icon: '⚡'
    });
  }

  if (analyzeNutrientLevel(soilData.iron) === 'low') {
    recommendations.push({
      category: 'Micronutrients',
      issue: 'Iron deficiency detected',
      recommendation: 'Apply Iron Sulfate or chelated iron. Improve soil drainage and reduce pH if alkaline.',
      priority: 'medium',
      icon: '🔧'
    });
  }

  // Determine overall status
  if (issueCount >= 3) {
    overallStatus = 'poor';
  } else if (issueCount >= 1) {
    overallStatus = 'fair';
  }

  // Generate summary
  let summary = '';
  if (overallStatus === 'good') {
    summary = 'Your soil health is in good condition! Continue with regular maintenance and balanced fertilization.';
  } else if (overallStatus === 'fair') {
    summary = 'Your soil needs some attention. Address the key nutrient deficiencies to improve crop yield.';
  } else {
    summary = 'Your soil requires immediate attention. Multiple nutrient deficiencies detected. Consider soil testing and comprehensive fertilization program.';
  }

  return {
    overall_status: overallStatus,
    recommendations,
    summary
  };
};

// Get fertilizer recommendations for specific crops
export const getCropSpecificRecommendations = (crop: string, soilData: SoilHealthData): FertilizerRecommendation[] => {
  const baseRecommendations = generateFertilizerRecommendations(soilData).recommendations;
  const cropSpecific: FertilizerRecommendation[] = [];

  const cropLower = crop.toLowerCase();

  // Crop-specific recommendations
  if (cropLower.includes('rice') || cropLower.includes('paddy')) {
    cropSpecific.push({
      category: 'Rice Specific',
      issue: 'Rice cultivation requirements',
      recommendation: 'Apply 120:60:40 NPK kg/ha. Split nitrogen application: 50% basal, 25% tillering, 25% panicle initiation.',
      priority: 'medium',
      icon: '🌾'
    });
  } else if (cropLower.includes('wheat')) {
    cropSpecific.push({
      category: 'Wheat Specific',
      issue: 'Wheat cultivation requirements',
      recommendation: 'Apply 120:60:40 NPK kg/ha. Apply full P&K and 1/3 N at sowing, remaining N in 2 splits.',
      priority: 'medium',
      icon: '🌾'
    });
  } else if (cropLower.includes('cotton')) {
    cropSpecific.push({
      category: 'Cotton Specific',
      issue: 'Cotton cultivation requirements',
      recommendation: 'Apply 150:75:75 NPK kg/ha. Higher potassium requirement for fiber quality.',
      priority: 'medium',
      icon: '🌿'
    });
  }

  return [...baseRecommendations, ...cropSpecific];
};
