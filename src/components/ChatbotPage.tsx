import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { ArrowLeft, MessageCircle, Mic, Send, Bot, User, Volume2, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { 
  generateChatResponse, 
  getQuickResponse, 
  textToSpeech, 
  generateMessageId,
  ChatMessage 
} from '@/services/chatbotService';

interface ChatbotPageProps {
  onBack: () => void;
}

const ChatbotPage = ({ onBack }: ChatbotPageProps) => {
  const { language } = useLanguageContext();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check voice recognition support
    const checkVoiceSupport = () => {
      const hasSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setVoiceSupported(hasSupport);
      if (!hasSupport) {
        console.warn('Speech recognition not supported in this browser');
      }
    };
    
    checkVoiceSupport();
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: getQuickResponse('hello', language),
      timestamp: new Date(),
      language
    };
    setMessages([welcomeMessage]);
  }, [language]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await generateChatResponse([...messages, userMessage], language);
      
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        language
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.success) {
        toast.success('Response generated!');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: getQuickResponse('error', language),
        timestamp: new Date(),
        language
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!voiceSupported) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start listening
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : language === 'pa' ? 'pa-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('🎤 Listening... Speak now');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
        toast.success('✅ Voice input captured!');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = 'Voice input failed';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not available. Check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow access.';
            break;
          case 'network':
            errorMessage = 'Network error. Check your connection.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        
        toast.error(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Microphone permission error:', error);
      toast.error('Microphone access denied. Please allow microphone permissions and try again.');
      setIsListening(false);
    }
  };

  const handleSpeakMessage = (text: string) => {
    textToSpeech(text, language);
    toast.info('Playing audio...');
  };

  const quickQuestions = [
    { 
      key: 'soil', 
      text: language === 'hi' ? 'मिट्टी की सेहत' : 
            language === 'te' ? 'మట్టి ఆరోగ్యం' : 
            language === 'pa' ? 'ਮਿੱਟੀ ਦੀ ਸਿਹਤ' : 'Soil Health' 
    },
    { 
      key: 'pest', 
      text: language === 'hi' ? 'कीट नियंत्रण' : 
            language === 'te' ? 'కీటకాల నియంత్రణ' : 
            language === 'pa' ? 'ਕੀੜੇ ਨਿਯੰਤਰਣ' : 'Pest Control' 
    },
    { 
      key: 'weather', 
      text: language === 'hi' ? 'मौसम सलाह' : 
            language === 'te' ? 'వాతావరణ సలహా' : 
            language === 'pa' ? 'ਮੌਸਮ ਸਲਾਹ' : 'Weather Advice' 
    },
    { 
      key: 'fertilizer', 
      text: language === 'hi' ? 'खाद सलाह' : 
            language === 'te' ? 'ఎరువు సలహా' : 
            language === 'pa' ? 'ਖਾਦ ਸਲਾਹ' : 'Fertilizer Tips' 
    }
  ];

  const handleQuickQuestion = (key: string) => {
    const response = getQuickResponse(key, language);
    setMessage(response);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-chatbot text-white p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" />
            <h1 className="text-lg font-bold">{t('aiChatbot')}</h1>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <Card className="h-96 mb-4">
          <CardHeader>
            <CardTitle className="text-center text-chatbot text-sm">
              AI Farming Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-16 w-16 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Start a conversation with your AI farming assistant
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ask about crops, weather, pests, or farming techniques
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-chatbot text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {msg.role === 'assistant' && (
                          <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        {msg.role === 'user' && (
                          <User className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {msg.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {msg.role === 'assistant' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSpeakMessage(msg.content)}
                                className="h-6 w-6 p-0 hover:bg-transparent"
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-chatbot rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-chatbot rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-chatbot rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-center text-sm">Quick Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question) => (
                  <Button
                    key={question.key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question.key)}
                    className="text-xs h-8"
                  >
                    {question.text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('chatPlaceholder')}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage}
              size="sm"
              className="bg-chatbot hover:bg-chatbot/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
              {!voiceSupported 
                ? (language === 'hi' ? 'आवाज़ समर्थित नहीं' : 
                   language === 'te' ? 'వాయిస్ మద్దతు లేదు' : 
                   language === 'pa' ? 'ਆਵਾਜ਼ ਸਮਰਥਿਤ ਨਹੀਂ' : 'Voice Not Supported')
                : isListening 
                  ? (language === 'hi' ? 'सुन रहा है... (रोकने के लिए टैप करें)' : 
                     language === 'te' ? 'వింటున్నాను... (ఆపడానికి టాప్ చేయండి)' : 
                     language === 'pa' ? 'ਸੁਣ ਰਿਹਾ ਹਾਂ... (ਰੋਕਣ ਲਈ ਟੈਪ ਕਰੋ)' : 'Listening... (Tap to stop)')
                  : (language === 'hi' ? 'आवाज़ इनपुट' : 
                     language === 'te' ? 'వాయిస్ ఇన్‌పుట్' : 
                     language === 'pa' ? 'ਆਵਾਜ਼ ਇਨਪੁੱਟ' : 'Voice Input')
                ? 'opacity-50 cursor-not-allowed' 
                : isListening 
                  ? 'bg-chatbot text-white border-chatbot' 
                  : 'border-chatbot text-chatbot hover:bg-chatbot/10'
            }`}
          >
            {!voiceSupported ? (
              <MicOff className="h-5 w-5 mr-2" />
            ) : (
              <Mic className={`h-5 w-5 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
            )}
            {!voiceSupported 
              ? 'Voice Not Supported' 
              : isListening 
                ? 'Listening... (Tap to stop)' 
                : 'Voice Input'
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;