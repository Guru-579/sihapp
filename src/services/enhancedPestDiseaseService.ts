import { detectPestDisease, PestDiseaseResult } from './pestDiseaseService';

export interface DetailedPestDiseaseResult extends Omit<PestDiseaseResult, 'treatment' | 'prevention'> {
  detailedAnalysis: {
    diseaseStage: 'early' | 'moderate' | 'severe' | 'critical';
    affectedArea: number; // percentage
    spreadRisk: 'low' | 'medium' | 'high';
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
  treatment: {
    immediate: TreatmentStep[];
    preventive: TreatmentStep[];
    organic: TreatmentStep[];
    chemical: TreatmentStep[];
  };
  detectedIssue?: string;
  prevention: {
    culturalPractices: string[];
    biologicalControl: string[];
    resistantVarieties: string[];
    seasonalTiming: string[];
  };
  economicImpact: {
    potentialLoss: string;
    treatmentCost: string;
    recoveryTime: string;
    marketImpact: string;
  };
  environmentalFactors: {
    favorableConditions: string[];
    weatherImpact: string;
    soilFactors: string[];
  };
}

export interface TreatmentStep {
  step: number;
  action: string;
  materials: string[];
  timing: string;
  dosage?: string;
  frequency: string;
  duration: string;
  cost?: string;
  effectiveness: number; // 1-10 scale
}

// Enhanced disease database with detailed information
const ENHANCED_DISEASE_DATABASE = {
  'leaf_blight': {
    name: 'Leaf Blight',
    scientificName: 'Alternaria alternata',
    severity: 'high',
    commonCrops: ['tomato', 'potato', 'wheat', 'rice'],
    symptoms: [
      'Brown spots with concentric rings on leaves',
      'Yellowing around spots',
      'Premature leaf drop',
      'Reduced photosynthesis'
    ],
    treatment: {
      immediate: [
        {
          step: 1,
          action: 'Remove affected leaves immediately',
          materials: ['Pruning shears', 'Disinfectant'],
          timing: 'As soon as spotted',
          frequency: 'Daily inspection',
          duration: '1-2 weeks',
          effectiveness: 8
        },
        {
          step: 2,
          action: 'Apply copper-based fungicide',
          materials: ['Copper oxychloride', 'Sprayer'],
          timing: 'Early morning or evening',
          dosage: '2g per liter',
          frequency: 'Every 7-10 days',
          duration: '3-4 weeks',
          cost: '₹200-300 per acre',
          effectiveness: 9
        }
      ],
      preventive: [
        {
          step: 1,
          action: 'Improve air circulation',
          materials: ['Pruning tools'],
          timing: 'Throughout growing season',
          frequency: 'Monthly',
          duration: 'Ongoing',
          effectiveness: 7
        }
      ],
      organic: [
        {
          step: 1,
          action: 'Apply neem oil spray',
          materials: ['Neem oil', 'Water', 'Emulsifier'],
          timing: 'Evening application',
          dosage: '5ml per liter',
          frequency: 'Every 5-7 days',
          duration: '2-3 weeks',
          cost: '₹150-200 per acre',
          effectiveness: 6
        }
      ],
      chemical: [
        {
          step: 1,
          action: 'Apply systemic fungicide',
          materials: ['Propiconazole', 'Sprayer'],
          timing: 'Before 10 AM',
          dosage: '1ml per liter',
          frequency: 'Every 14 days',
          duration: '4-6 weeks',
          cost: '₹400-500 per acre',
          effectiveness: 9
        }
      ]
    },
    prevention: {
      culturalPractices: [
        'Crop rotation with non-host plants',
        'Proper spacing for air circulation',
        'Avoid overhead irrigation',
        'Remove crop residues after harvest'
      ],
      biologicalControl: [
        'Use Trichoderma viride as soil treatment',
        'Apply Bacillus subtilis foliar spray',
        'Encourage beneficial insects'
      ],
      resistantVarieties: [
        'Choose disease-resistant cultivars',
        'Use certified disease-free seeds',
        'Plant early maturing varieties'
      ],
      seasonalTiming: [
        'Avoid planting during high humidity periods',
        'Time planting to avoid monsoon stress',
        'Harvest before peak disease season'
      ]
    },
    economicImpact: {
      potentialLoss: '20-40% yield reduction if untreated',
      treatmentCost: '₹300-800 per acre depending on method',
      recoveryTime: '3-6 weeks with proper treatment',
      marketImpact: 'Reduced quality affects market price by 15-25%'
    },
    environmentalFactors: {
      favorableConditions: [
        'High humidity (>80%)',
        'Temperature 20-30°C',
        'Poor air circulation',
        'Wet foliage for extended periods'
      ],
      weatherImpact: 'Spreads rapidly during monsoon and post-monsoon periods',
      soilFactors: [
        'Poor drainage increases risk',
        'High nitrogen levels can increase susceptibility',
        'Compacted soil reduces plant vigor'
      ]
    }
  },
  'powdery_mildew': {
    name: 'Powdery Mildew',
    scientificName: 'Erysiphe cichoracearum',
    severity: 'medium',
    commonCrops: ['cucumber', 'tomato', 'grape', 'rose'],
    symptoms: [
      'White powdery coating on leaves',
      'Stunted growth',
      'Yellowing of leaves',
      'Reduced fruit quality'
    ],
    treatment: {
      immediate: [
        {
          step: 1,
          action: 'Apply baking soda solution',
          materials: ['Baking soda', 'Water', 'Liquid soap'],
          timing: 'Early morning',
          dosage: '5g per liter + 2ml soap',
          frequency: 'Every 3-4 days',
          duration: '2 weeks',
          cost: '₹50-100 per acre',
          effectiveness: 6
        }
      ],
      organic: [
        {
          step: 1,
          action: 'Milk spray treatment',
          materials: ['Fresh milk', 'Water'],
          timing: 'Morning application',
          dosage: '1:10 ratio with water',
          frequency: 'Every 5 days',
          duration: '3 weeks',
          cost: '₹100-150 per acre',
          effectiveness: 7
        }
      ]
    }
  },
  'bacterial_spot': {
    name: 'Bacterial Spot',
    scientificName: 'Xanthomonas campestris',
    severity: 'high',
    commonCrops: ['tomato', 'pepper', 'peach'],
    symptoms: [
      'Small dark spots on leaves',
      'Yellow halo around spots',
      'Fruit lesions',
      'Defoliation in severe cases'
    ]
  }
};

export const performEnhancedPestDiseaseAnalysis = async (
  file: File,
  cropType?: string,
  location?: { latitude: number; longitude: number }
): Promise<DetailedPestDiseaseResult> => {
  try {
    // First get basic detection result
    const basicResult = await detectPestDisease(file);
    
    if (!basicResult.success) {
      throw new Error(basicResult.error || 'Detection failed');
    }

    // Get detailed information from database
    const diseaseKey = basicResult.disease?.toLowerCase().replace(/\s+/g, '_');
    const diseaseInfo = ENHANCED_DISEASE_DATABASE[diseaseKey] || ENHANCED_DISEASE_DATABASE['leaf_blight'];

    // Analyze image for severity (mock analysis - in production, use AI)
    const severity = analyzeSeverity(basicResult.confidence);
    const affectedArea = estimateAffectedArea(basicResult.confidence);
    const spreadRisk = calculateSpreadRisk(severity, location);

    const detailedResult: DetailedPestDiseaseResult = {
      ...basicResult,
      detailedAnalysis: {
        diseaseStage: severity,
        affectedArea,
        spreadRisk,
        urgency: severity === 'critical' ? 'critical' : severity === 'severe' ? 'high' : 'medium'
      },
      treatment: diseaseInfo.treatment || {
        immediate: [],
        preventive: [],
        organic: [],
        chemical: []
      },
      prevention: diseaseInfo.prevention || {
        culturalPractices: [],
        biologicalControl: [],
        resistantVarieties: [],
        seasonalTiming: []
      },
      economicImpact: diseaseInfo.economicImpact || {
        potentialLoss: 'Variable based on severity',
        treatmentCost: '₹200-500 per acre',
        recoveryTime: '2-4 weeks',
        marketImpact: 'May affect quality grading'
      },
      environmentalFactors: diseaseInfo.environmentalFactors || {
        favorableConditions: ['High humidity', 'Warm temperatures'],
        weatherImpact: 'Weather dependent spread',
        soilFactors: ['Drainage important']
      }
    };

    return detailedResult;
  } catch (error) {
    console.error('Enhanced analysis error:', error);
    throw error;
  }
};

const analyzeSeverity = (confidence: number): 'early' | 'moderate' | 'severe' | 'critical' => {
  if (confidence > 0.9) return 'critical';
  if (confidence > 0.7) return 'severe';
  if (confidence > 0.5) return 'moderate';
  return 'early';
};

const estimateAffectedArea = (confidence: number): number => {
  // Mock calculation - in production, use image analysis
  if (confidence > 0.9) return Math.floor(Math.random() * 30) + 50; // 50-80%
  if (confidence > 0.7) return Math.floor(Math.random() * 30) + 25; // 25-55%
  if (confidence > 0.5) return Math.floor(Math.random() * 20) + 10; // 10-30%
  return Math.floor(Math.random() * 10) + 5; // 5-15%
};

const calculateSpreadRisk = (
  severity: string, 
  location?: { latitude: number; longitude: number }
): 'low' | 'medium' | 'high' => {
  // Mock calculation based on severity and location
  if (severity === 'critical' || severity === 'severe') return 'high';
  if (severity === 'moderate') return 'medium';
  return 'low';
};

export const generateTreatmentPlan = (result: DetailedPestDiseaseResult): string => {
  const { detailedAnalysis, treatment } = result;
  
  let plan = `Treatment Plan for ${result.disease || 'Plant Issue'}\n\n`;
  plan += `Severity: ${detailedAnalysis.diseaseStage.toUpperCase()}\n`;
  plan += `Affected Area: ${detailedAnalysis.affectedArea}%\n`;
  plan += `Urgency: ${detailedAnalysis.urgency.toUpperCase()}\n\n`;
  
  plan += "IMMEDIATE ACTIONS:\n";
  treatment.immediate.forEach((step, index) => {
    plan += `${index + 1}. ${step.action}\n`;
    plan += `   Materials: ${step.materials.join(', ')}\n`;
    plan += `   Frequency: ${step.frequency}\n`;
    if (step.cost) plan += `   Cost: ${step.cost}\n`;
    plan += `   Effectiveness: ${step.effectiveness}/10\n\n`;
  });
  
  return plan;
};
