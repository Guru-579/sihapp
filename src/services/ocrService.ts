import Tesseract from 'tesseract.js';

export interface SoilHealthData {
  pH: number | null;
  nitrogen: string | null;
  phosphorus: string | null;
  potassium: string | null;
  organicCarbon: number | null;
  ec: number | null; // Electrical Conductivity
  zinc: string | null;
  iron: string | null;
  manganese: string | null;
  copper: string | null;
}

export interface OCRResult {
  success: boolean;
  text: string;
  soilData: SoilHealthData;
  error?: string;
}

// Extract soil health parameters from OCR text
const extractSoilData = (text: string): SoilHealthData => {
  const cleanText = text.toLowerCase().replace(/[^\w\s.:]/g, ' ');
  
  const soilData: SoilHealthData = {
    pH: null,
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    organicCarbon: null,
    ec: null,
    zinc: null,
    iron: null,
    manganese: null,
    copper: null,
  };

  // pH extraction patterns
  const phPatterns = [
    /ph[\s:]*(\d+\.?\d*)/,
    /ph[\s]*value[\s:]*(\d+\.?\d*)/,
    /soil[\s]*ph[\s:]*(\d+\.?\d*)/
  ];
  
  for (const pattern of phPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      soilData.pH = parseFloat(match[1]);
      break;
    }
  }

  // Nitrogen extraction
  const nitrogenPatterns = [
    /nitrogen[\s:]*(\w+)/,
    /n[\s:]*(\w+)/,
    /available[\s]*nitrogen[\s:]*(\w+)/
  ];
  
  for (const pattern of nitrogenPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1] !== 'ph') {
      soilData.nitrogen = match[1];
      break;
    }
  }

  // Phosphorus extraction
  const phosphorusPatterns = [
    /phosphorus[\s:]*(\w+)/,
    /p[\s:]*(\w+)/,
    /available[\s]*phosphorus[\s:]*(\w+)/
  ];
  
  for (const pattern of phosphorusPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1] !== 'ph') {
      soilData.phosphorus = match[1];
      break;
    }
  }

  // Potassium extraction
  const potassiumPatterns = [
    /potassium[\s:]*(\w+)/,
    /k[\s:]*(\w+)/,
    /available[\s]*potassium[\s:]*(\w+)/
  ];
  
  for (const pattern of potassiumPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1] !== 'ph') {
      soilData.potassium = match[1];
      break;
    }
  }

  // Organic Carbon extraction
  const ocPatterns = [
    /organic[\s]*carbon[\s:]*(\d+\.?\d*)/,
    /oc[\s:]*(\d+\.?\d*)/,
    /carbon[\s:]*(\d+\.?\d*)/
  ];
  
  for (const pattern of ocPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      soilData.organicCarbon = parseFloat(match[1]);
      break;
    }
  }

  // EC extraction
  const ecPatterns = [
    /ec[\s:]*(\d+\.?\d*)/,
    /electrical[\s]*conductivity[\s:]*(\d+\.?\d*)/,
    /conductivity[\s:]*(\d+\.?\d*)/
  ];
  
  for (const pattern of ecPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      soilData.ec = parseFloat(match[1]);
      break;
    }
  }

  // Micronutrients
  const zincMatch = cleanText.match(/zinc[\s:]*(\w+)/);
  if (zincMatch) soilData.zinc = zincMatch[1];

  const ironMatch = cleanText.match(/iron[\s:]*(\w+)/);
  if (ironMatch) soilData.iron = ironMatch[1];

  const manganeseMatch = cleanText.match(/manganese[\s:]*(\w+)/);
  if (manganeseMatch) soilData.manganese = manganeseMatch[1];

  const copperMatch = cleanText.match(/copper[\s:]*(\w+)/);
  if (copperMatch) soilData.copper = copperMatch[1];

  return soilData;
};

// Perform OCR on image file
export const performOCR = async (imageFile: File): Promise<OCRResult> => {
  try {
    console.log('Starting OCR process...');
    
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log(m)
      }
    );

    console.log('OCR completed. Extracted text:', text);
    
    const soilData = extractSoilData(text);
    
    return {
      success: true,
      text,
      soilData
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      text: '',
      soilData: {
        pH: null,
        nitrogen: null,
        phosphorus: null,
        potassium: null,
        organicCarbon: null,
        ec: null,
        zinc: null,
        iron: null,
        manganese: null,
        copper: null,
      },
      error: error instanceof Error ? error.message : 'Unknown OCR error'
    };
  }
};

// Perform OCR on image URL
export const performOCRFromURL = async (imageUrl: string): Promise<OCRResult> => {
  try {
    console.log('Starting OCR process from URL...');
    
    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      'eng',
      {
        logger: m => console.log(m)
      }
    );

    console.log('OCR completed. Extracted text:', text);
    
    const soilData = extractSoilData(text);
    
    return {
      success: true,
      text,
      soilData
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      text: '',
      soilData: {
        pH: null,
        nitrogen: null,
        phosphorus: null,
        potassium: null,
        organicCarbon: null,
        ec: null,
        zinc: null,
        iron: null,
        manganese: null,
        copper: null,
      },
      error: error instanceof Error ? error.message : 'Unknown OCR error'
    };
  }
};
