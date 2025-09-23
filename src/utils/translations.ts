export type Language = 'en' | 'hi' | 'te' | 'pa';

export const languages = [
  { code: 'en' as Language, name: 'English', native: 'English' },
  { code: 'hi' as Language, name: 'Hindi', native: 'हिंदी' },
  { code: 'te' as Language, name: 'Telugu', native: 'తెలుగు' },
  { code: 'pa' as Language, name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export const translations = {
  en: {
    // Auth
    login: 'Login',
    mobileNumber: 'Mobile Number',
    getOtp: 'Get OTP',
    enterOtp: 'Enter OTP',
    verifyLogin: 'Verify & Login',
    selectLanguage: 'Select Language',
    
    // Dashboard
    dashboard: 'Dashboard',
    welcome: 'Welcome, Farmer!',
    
    // Features
    soilHealth: 'Soil Health',
    weather: 'Weather',
    pestDisease: 'Pest/Disease',
    marketPrices: 'Market Prices',
    aiChatbot: 'AI Assistant',
    
    // Actions
    captureImage: 'Capture Image',
    uploadFile: 'Upload File',
    uploadImage: 'Upload Image',
    selectCrop: 'Select Crop',
    selectDistrict: 'Select District',
    
    // Placeholders
    soilResults: 'Soil results will appear here',
    weatherInfo: 'Weather information will appear here',
    pestResults: 'Pest/Disease results will appear here',
    marketData: 'Mandi prices will appear here',
    chatPlaceholder: 'Ask me anything about farming...',
    
    // Navigation
    back: 'Back',
    notifications: 'Notifications',
    profile: 'Profile',
  },
  
  hi: {
    // Auth
    login: 'लॉगिन',
    mobileNumber: 'मोबाइल नंबर',
    getOtp: 'OTP प्राप्त करें',
    enterOtp: 'OTP दर्ज करें',
    verifyLogin: 'सत्यापित करें और लॉगिन करें',
    selectLanguage: 'भाषा चुनें',
    
    // Dashboard
    dashboard: 'डैशबोर्ड',
    welcome: 'स्वागत है, किसान जी!',
    
    // Features
    soilHealth: 'मिट्टी की सेहत',
    weather: 'मौसम',
    pestDisease: 'कीट/रोग',
    marketPrices: 'बाजार भाव',
    aiChatbot: 'AI सहायक',
    
    // Actions
    captureImage: 'फोटो लें',
    uploadFile: 'फाइल अपलोड करें',
    uploadImage: 'फोटो अपलोड करें',
    selectCrop: 'फसल चुनें',
    selectDistrict: 'जिला चुनें',
    
    // Placeholders
    soilResults: 'मिट्टी के परिणाम यहाँ दिखेंगे',
    weatherInfo: 'मौसम की जानकारी यहाँ दिखेगी',
    pestResults: 'कीट/रोग के परिणाम यहाँ दिखेंगे',
    marketData: 'मंडी के भाव यहाँ दिखेंगे',
    chatPlaceholder: 'खेती के बारे में कुछ भी पूछें...',
    
    // Navigation
    back: 'वापस',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
  },
  
  te: {
    // Auth
    login: 'లాగిన్',
    mobileNumber: 'మొబైల్ నంబర్',
    getOtp: 'OTP పొందండి',
    enterOtp: 'OTP ప్రవేశపెట్టండి',
    verifyLogin: 'ధృవీకరించి లాగిన్ అవ్వండి',
    selectLanguage: 'భాష ఎంచుకోండి',
    
    // Dashboard
    dashboard: 'డ్యాష్‌బోర్డ్',
    welcome: 'స్వాగతం, రైతు గారు!',
    
    // Features
    soilHealth: 'మట్టి ఆరోగ్యం',
    weather: 'వాతావరణం',
    pestDisease: 'కీటకాలు/వ్యాధులు',
    marketPrices: 'మార్కెట్ ధరలు',
    aiChatbot: 'AI సహాయకుడు',
    
    // Actions
    captureImage: 'ఫోటో తీయండి',
    uploadFile: 'ఫైల్ అప్‌లోడ్ చేయండి',
    uploadImage: 'ఫోటో అప్‌లోడ్ చేయండి',
    selectCrop: 'పంట ఎంచుకోండి',
    selectDistrict: 'జిల్లా ఎంచుకోండి',
    
    // Placeholders
    soilResults: 'మట్టి ఫలితాలు ఇక్కడ కనిపిస్తాయి',
    weatherInfo: 'వాతావరణ సమాచారం ఇక్కడ కనిపిస్తుంది',
    pestResults: 'కీటకాలు/వ్యాధుల ఫలితాలు ఇక్కడ కనిపిస్తాయి',
    marketData: 'మండి ధరలు ఇక్కడ కనిపిస్తాయి',
    chatPlaceholder: 'వ్యవసాయం గురించి ఏదైనా అడగండి...',
    
    // Navigation
    back: 'వెనుకకు',
    notifications: 'నోటిఫికేషన్లు',
    profile: 'ప్రొఫైల్',
  },
  
  pa: {
    // Auth
    login: 'ਲਾਗਇਨ',
    mobileNumber: 'ਮੋਬਾਇਲ ਨੰਬਰ',
    getOtp: 'OTP ਲਵੋ',
    enterOtp: 'OTP ਦਾਖਲ ਕਰੋ',
    verifyLogin: 'ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਲਾਗਇਨ ਕਰੋ',
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    
    // Dashboard
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ ਜੀ!',
    
    // Features
    soilHealth: 'ਮਿੱਟੀ ਦੀ ਸਿਹਤ',
    weather: 'ਮੌਸਮ',
    pestDisease: 'ਕੀੜੇ/ਬਿਮਾਰੀ',
    marketPrices: 'ਮਾਰਕੀਟ ਰੇਟ',
    aiChatbot: 'AI ਸਹਾਇਕ',
    
    // Actions
    captureImage: 'ਫੋਟੋ ਖਿੱਚੋ',
    uploadFile: 'ਫਾਇਲ ਅਪਲੋਡ ਕਰੋ',
    uploadImage: 'ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
    selectCrop: 'ਫਸਲ ਚੁਣੋ',
    selectDistrict: 'ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
    
    // Placeholders
    soilResults: 'ਮਿੱਟੀ ਦੇ ਨਤੀਜੇ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ',
    weatherInfo: 'ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗੀ',
    pestResults: 'ਕੀੜੇ/ਬਿਮਾਰੀ ਦੇ ਨਤੀਜੇ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ',
    marketData: 'ਮੰਡੀ ਦੇ ਰੇਟ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ',
    chatPlaceholder: 'ਖੇਤੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...',
    
    // Navigation
    back: 'ਵਾਪਸ',
    notifications: 'ਸੂਚਨਾਵਾਂ',
    profile: 'ਪ੍ਰੋਫਾਇਲ',
  },
} as const;

export const useTranslation = (language: Language) => {
  return {
    t: (key: keyof typeof translations.en) => translations[language][key],
    language,
  };
};