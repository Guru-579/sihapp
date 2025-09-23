export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

export interface ChatbotResponse {
  success: boolean;
  message: string;
  error?: string;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt for agricultural chatbot
const SYSTEM_PROMPT = `You are an expert agricultural advisor and farming assistant. Your role is to help farmers with:

1. Crop management and cultivation techniques
2. Soil health and fertilizer recommendations
3. Pest and disease identification and treatment
4. Weather-related farming advice
5. Market prices and crop selection
6. Sustainable farming practices
7. Irrigation and water management
8. Harvest timing and storage

Guidelines:
- Provide practical, actionable advice
- Consider local farming conditions in India
- Suggest cost-effective solutions
- Prioritize organic and sustainable methods when possible
- Be specific about quantities, timing, and methods
- Ask clarifying questions when needed
- Keep responses concise but comprehensive
- Use simple language that farmers can understand

Always be helpful, accurate, and supportive. If you're unsure about something, recommend consulting with local agricultural extension officers.`;

// Language-specific system prompts
const LANGUAGE_PROMPTS = {
  en: SYSTEM_PROMPT,
  te: SYSTEM_PROMPT + '\n\nRespond in Telugu language.',
  hi: SYSTEM_PROMPT + '\n\nRespond in Hindi language.',
  pa: SYSTEM_PROMPT + '\n\nRespond in Punjabi language.'
};

// Generate chat response using OpenAI
export const generateChatResponse = async (
  messages: ChatMessage[],
  language: string = 'en'
): Promise<ChatbotResponse> => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare messages for OpenAI API
    const openaiMessages = [
      {
        role: 'system',
        content: LANGUAGE_PROMPTS[language as keyof typeof LANGUAGE_PROMPTS] || LANGUAGE_PROMPTS.en
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response generated');
    }

    return {
      success: true,
      message: assistantMessage.trim()
    };

  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Fallback responses based on language
    const fallbackResponses = {
      en: "I'm having trouble connecting right now. Please try asking about soil health, pest control, weather advice, or crop management, and I'll do my best to help!",
      te: "ప్రస్తుతం కనెక్ట్ అవ్వడంలో సమస్య ఉంది. దయచేసి మట్టి ఆరోగ్యం, కీటకాల నియంత్రణ, వాతావరణ సలహా లేదా పంట నిర్వహణ గురించి అడగండి!",
      hi: "अभी कनेक्ट करने में समस्या हो रही है। कृपया मिट्टी की सेहत, कीट नियंत्रण, मौसम सलाह या फसल प्रबंधन के बारे में पूछें!",
      pa: "ਹੁਣ ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮਿੱਟੀ ਦੀ ਸਿਹਤ, ਕੀੜੇ ਨਿਯੰਤਰਣ, ਮੌਸਮ ਸਲਾਹ ਜਾਂ ਫਸਲ ਪ੍ਰਬੰਧਨ ਬਾਰੇ ਪੁੱਛੋ!"
    };

    return {
      success: false,
      message: fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Get quick response for common queries
export const getQuickResponse = (query: string, language: string = 'en'): string => {
  const lowerQuery = query.toLowerCase();
  
  const responses = {
    en: {
      greeting: "Hello! I'm your farming assistant. How can I help you today?",
      soil: "For healthy soil, maintain pH between 6.0-7.0, add organic compost regularly, and test soil every 6 months.",
      water: "Water early morning or evening. Check soil moisture 2 inches deep. Most crops need 1-2 inches per week.",
      pest: "For pest control, try neem oil spray, companion planting, and regular field inspection. Identify pests early for best results.",
      weather: "Monitor weather forecasts daily. Protect crops from extreme weather with mulching, shade nets, or row covers.",
      fertilizer: "Use balanced NPK fertilizer. Apply organic compost first, then chemical fertilizers as needed. Don't over-fertilize."
    },
    te: {
      greeting: "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడిని. ఈరోజు మీకు ఎలా సహాయం చేయగలను?",
      soil: "ఆరోగ్యకరమైన మట్టి కోసం, pH 6.0-7.0 మధ్య ఉంచండి, క్రమం తప్పకుండా సేంద్రీయ కంపోస్ట్ జోడించండి.",
      water: "ఉదయం లేదా సాయంత్రం నీరు పోయండి. 2 అంగుళాల లోతులో మట్టి తేమను తనిఖీ చేయండి.",
      pest: "కీటకాల నియంత్రణ కోసం వేప నూనె స్ప్రే, సహచర మొక్కలు, క్రమం తప్పకుండా పొలం తనిఖీ చేయండి.",
      weather: "ప్రతిరోజూ వాతావరణ సమాచారం చూడండి. తీవ్రమైన వాతావరణం నుండి పంటలను రక్షించండి.",
      fertilizer: "సమతుల్య NPK ఎరువులు వాడండి. మొదట సేంద్రీయ కంపోస్ట్, తర్వాత అవసరమైతే రసాయన ఎరువులు."
    },
    hi: {
      greeting: "नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      soil: "स्वस्थ मिट्टी के लिए pH 6.0-7.0 बनाए रखें, नियमित रूप से जैविक खाद डालें।",
      water: "सुबह या शाम पानी दें। 2 इंच गहराई में मिट्टी की नमी जांचें।",
      pest: "कीट नियंत्रण के लिए नीम तेल स्प्रे, साथी पौधे, नियमित खेत निरीक्षण करें।",
      weather: "रोज मौसम पूर्वानुमान देखें। चरम मौसम से फसलों को बचाएं।",
      fertilizer: "संतुलित NPK उर्वरक का उपयोग करें। पहले जैविक खाद, फिर रासायनिक उर्वरक।"
    },
    pa: {
      greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
      soil: "ਸਿਹਤਮੰਦ ਮਿੱਟੀ ਲਈ pH 6.0-7.0 ਰੱਖੋ, ਨਿਯਮਿਤ ਜੈਵਿਕ ਖਾਦ ਪਾਓ।",
      water: "ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਪਾਣੀ ਦਿਓ। 2 ਇੰਚ ਡੂੰਘਾਈ ਵਿੱਚ ਮਿੱਟੀ ਦੀ ਨਮੀ ਚੈੱਕ ਕਰੋ।",
      pest: "ਕੀੜੇ ਨਿਯੰਤਰਣ ਲਈ ਨਿੰਮ ਤੇਲ ਸਪਰੇ, ਸਾਥੀ ਪੌਧੇ, ਨਿਯਮਿਤ ਖੇਤ ਜਾਂਚ।",
      weather: "ਰੋਜ਼ ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ ਦੇਖੋ। ਤੀਬਰ ਮੌਸਮ ਤੋਂ ਫਸਲਾਂ ਦੀ ਰੱਖਿਆ ਕਰੋ।",
      fertilizer: "ਸੰਤੁਲਿਤ NPK ਖਾਦ ਵਰਤੋ। ਪਹਿਲਾਂ ਜੈਵਿਕ ਖਾਦ, ਫਿਰ ਰਸਾਇਣਿਕ ਖਾਦ।"
    }
  };

  const langResponses = responses[language as keyof typeof responses] || responses.en;

  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('namaste')) {
    return langResponses.greeting;
  } else if (lowerQuery.includes('soil') || lowerQuery.includes('मिट्टी') || lowerQuery.includes('మట్టి')) {
    return langResponses.soil;
  } else if (lowerQuery.includes('water') || lowerQuery.includes('irrigation') || lowerQuery.includes('पानी')) {
    return langResponses.water;
  } else if (lowerQuery.includes('pest') || lowerQuery.includes('insect') || lowerQuery.includes('कीट')) {
    return langResponses.pest;
  } else if (lowerQuery.includes('weather') || lowerQuery.includes('मौसम') || lowerQuery.includes('వాతావరణం')) {
    return langResponses.weather;
  } else if (lowerQuery.includes('fertilizer') || lowerQuery.includes('खाद') || lowerQuery.includes('ఎరువు')) {
    return langResponses.fertilizer;
  }

  return langResponses.greeting;
};

// Generate message ID
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Translate text using a simple translation service (fallback)
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // This is a simple fallback - in production, you'd use Google Translate API or similar
  if (targetLanguage === 'en') return text;
  
  // For demo purposes, return the original text with a note
  return text + ` [Translated to ${targetLanguage}]`;
};

// Voice-to-text simulation (in production, use Web Speech API or similar)
export const speechToText = async (audioBlob: Blob): Promise<string> => {
  // This would integrate with Web Speech API or a service like Whisper
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Voice input received - please implement Web Speech API integration");
    }, 1000);
  });
};

// Text-to-speech using Web Speech API
export const textToSpeech = (text: string, language: string = 'en'): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    const languageMap: { [key: string]: string } = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
      pa: 'pa-IN'
    };
    
    utterance.lang = languageMap[language] || 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported');
  }
};
