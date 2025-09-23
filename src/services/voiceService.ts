import { useLanguageContext } from '@/contexts/LanguageContext';

export interface VoiceSettings {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

class VoiceService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
  }

  // Language mapping for speech synthesis
  private getVoiceLanguage(appLanguage: string): string {
    const languageMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'te': 'te-IN',
      'pa': 'pa-IN'
    };
    return languageMap[appLanguage] || 'en-US';
  }

  // Get available voices for a language
  private getVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
    const voices = this.synthesis.getVoices();
    
    // If no voices loaded yet, wait for them
    if (voices.length === 0) {
      return null;
    }
    
    const targetLang = this.getVoiceLanguage(language);
    
    // Try to find exact language match
    let voice = voices.find(v => v.lang === targetLang);
    
    // Fallback to language family (e.g., 'hi' for 'hi-IN')
    if (!voice) {
      const langFamily = targetLang.split('-')[0];
      voice = voices.find(v => v.lang.startsWith(langFamily));
    }
    
    // Try alternative language codes for Indian languages
    if (!voice && language !== 'en') {
      const alternativeCodes = {
        'hi': ['hi', 'hi-IN', 'hi-Latn'],
        'te': ['te', 'te-IN'],
        'pa': ['pa', 'pa-IN', 'pa-Guru']
      };
      
      const alternatives = alternativeCodes[language] || [];
      for (const altCode of alternatives) {
        voice = voices.find(v => v.lang.includes(altCode));
        if (voice) break;
      }
    }
    
    // Final fallback to English
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('en'));
    }
    
    return voice || voices[0] || null;
  }

  // Speak text with language-specific voice
  async speak(text: string, language: string = 'en', settings?: Partial<VoiceSettings>): Promise<void> {
    if (!this.isSupported || !text.trim()) {
      console.warn('Speech synthesis not supported or empty text');
      return;
    }

    // Stop any current speech
    this.stop();
    
    // Wait for voices to load if they haven't already
    const voices = this.synthesis.getVoices();
    if (voices.length === 0) {
      await new Promise<void>((resolve) => {
        const checkVoices = () => {
          if (this.synthesis.getVoices().length > 0) {
            resolve();
          } else {
            setTimeout(checkVoices, 100);
          }
        };
        
        this.synthesis.onvoiceschanged = () => {
          resolve();
        };
        
        // Fallback timeout
        setTimeout(() => resolve(), 2000);
        checkVoices();
      });
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice based on language
      const voice = this.getVoiceForLanguage(language);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
        console.log(`Using voice: ${voice.name} (${voice.lang}) for language: ${language}`);
      } else {
        utterance.lang = this.getVoiceLanguage(language);
        console.log(`No specific voice found, using language code: ${utterance.lang}`);
      }

      // Apply settings
      utterance.rate = settings?.rate || (language === 'en' ? 0.9 : 0.8); // Slower for non-English
      utterance.pitch = settings?.pitch || 1;
      utterance.volume = settings?.volume || 1;

      // Event handlers
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        console.error('Speech synthesis error:', event.error);
        
        // Try fallback with English if non-English fails
        if (language !== 'en') {
          console.log('Retrying with English voice...');
          this.speak(text, 'en', settings).then(resolve).catch(reject);
        } else {
          reject(event);
        }
      };

      utterance.onstart = () => {
        console.log(`Speech started (${language}):`, text.substring(0, 50) + '...');
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  // Stop current speech
  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  // Pause current speech
  pause(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  // Resume paused speech
  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  // Check if paused
  isPaused(): boolean {
    return this.synthesis.paused;
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  // Check if speech synthesis is supported
  isSpeechSupported(): boolean {
    return this.isSupported;
  }
}

// Global voice service instance
export const voiceService = new VoiceService();

// React hook for voice functionality
export const useVoiceAssistant = () => {
  const { language } = useLanguageContext();

  const speak = async (text: string, customLanguage?: string) => {
    try {
      await voiceService.speak(text, customLanguage || language);
    } catch (error) {
      console.error('Voice assistant error:', error);
    }
  };

  const stop = () => {
    voiceService.stop();
  };

  const pause = () => {
    voiceService.pause();
  };

  const resume = () => {
    voiceService.resume();
  };

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking: voiceService.isSpeaking(),
    isPaused: voiceService.isPaused(),
    isSupported: voiceService.isSpeechSupported()
  };
};

// Predefined voice messages for common scenarios
export const VoiceMessages = {
  welcome: {
    en: "Welcome to Digital Kheti, your smart farming assistant",
    hi: "डिजिटल खेती में आपका स्वागत है, आपका स्मार्ट कृषि सहायक",
    te: "డిజిటల్ ఖేతీకి స్వాగతం, మీ స్మార్ట్ వ్యవసాయ సహాయకుడు",
    pa: "ਡਿਜੀਟਲ ਖੇਤੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ, ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਕ"
  },
  analyzing: {
    en: "Analyzing your data, please wait",
    hi: "आपके डेटा का विश्लेषण कर रहे हैं, कृपया प्रतीक्षा करें",
    te: "మీ డేటాను విశ్లేషిస్తున్నాము, దయచేసి వేచి ఉండండి",
    pa: "ਤੁਹਾਡੇ ਡੇਟਾ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ, ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ"
  },
  analysisComplete: {
    en: "Analysis complete. Here are your results",
    hi: "विश्लेषण पूरा हुआ। यहाँ आपके परिणाम हैं",
    te: "విశ్లేషణ పూర్తయింది. ఇవి మీ ఫలితాలు",
    pa: "ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋਇਆ। ਇਹ ਤੁਹਾਡੇ ਨਤੀਜੇ ਹਨ"
  },
  weatherAlert: {
    en: "Weather alert for your location",
    hi: "आपके स्थान के लिए मौसम चेतावनी",
    te: "మీ ప్రాంతానికి వాతావరణ హెచ్చరిక",
    pa: "ਤੁਹਾਡੇ ਸਥਾਨ ਲਈ ਮੌਸਮ ਚੇਤਾਵਨੀ"
  }
};

// Initialize voices when they become available
if (typeof window !== 'undefined') {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log('Speech synthesis voices loaded:', voices.length);
    voices.forEach(voice => {
      console.log(`Available voice: ${voice.name} (${voice.lang})`);
    });
  };
  
  window.speechSynthesis.onvoiceschanged = loadVoices;
  
  // Also try to load voices immediately
  setTimeout(loadVoices, 100);
}
