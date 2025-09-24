import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/services/voiceService';
import SpeakerButton from '@/components/ui/speaker-button';
import { ArrowLeft, Send, Mic, MicOff, MessageCircle, Bot, User, Sparkles, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateChatResponse, ChatMessage, generateMessageId } from '@/services/chatbotService';
import heroChatbot from '@/assets/hero-chatbot.jpg';

interface ChatbotPageProps {
  onBack: () => void;
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({ onBack }) => {
  const { language } = useLanguageContext();
  const { t } = useTranslation();
  const { speak } = useVoiceAssistant();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'en' ? 'en-US' : 
                                     language === 'hi' ? 'hi-IN' : 
                                     language === 'te' ? 'te-IN' : 
                                     language === 'pa' ? 'pa-IN' : 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast.error('Voice recognition failed. Please try again.');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [language]);

  // Send welcome message on component mount
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      language
    };
    setMessages([welcomeMessage]);
  }, [language]);

  const getWelcomeMessage = () => {
    const welcomeMessages = {
      en: "Hello! I'm your AI farming assistant. I can help you with crop management, soil health, pest control, weather advice, and market information. How can I assist you today?",
      hi: "नमस्ते! मैं आपका AI कृषि सहायक हूं। मैं फसल प्रबंधन, मिट्टी की सेहत, कीट नियंत्रण, मौसम सलाह और बाजार की जानकारी में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      te: "నమస్కారం! నేను మీ AI వ్యవసాయ సహాయకుడిని. పంట నిర్వహణ, మట్టి ఆరోగ్యం, కీటకాల నియంత్రణ, వాతావరణ సలహా మరియు మార్కెట్ సమాచారంలో నేను మీకు సహాయం చేయగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਫਸਲ ਪ੍ਰਬੰਧਨ, ਮਿੱਟੀ ਦੀ ਸਿਹਤ, ਕੀੜੇ ਨਿਯੰਤਰਣ, ਮੌਸਮ ਸਲਾਹ ਅਤੇ ਮਾਰਕੀਟ ਦੀ ਜਾਣਕਾਰੀ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ?"
    };
    return welcomeMessages[language] || welcomeMessages.en;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await generateChatResponse([...messages, userMessage], language);
      
      if (response.success) {
        const assistantMessage: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          language
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Auto-speak the response
        speak(response.message);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        language
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const quickQuestions = [
    {
      en: "How to improve soil health?",
      hi: "मिट्टी की सेहत कैसे सुधारें?",
      te: "మట్టి ఆరోగ్యాన్ని ఎలా మెరుగుపరచాలి?",
      pa: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਕਿਵੇਂ ਸੁਧਾਰੀਏ?"
    },
    {
      en: "Best fertilizer for my crop?",
      hi: "मेरी फसल के लिए सबसे अच्छी खाद?",
      te: "నా పంటకు ఉత్తమ ఎరువు?",
      pa: "ਮੇਰੀ ਫਸਲ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਖਾਦ?"
    },
    {
      en: "When to irrigate crops?",
      hi: "फसलों की सिंचाई कब करें?",
      te: "పంటలకు ఎప్పుడు నీరు పోయాలి?",
      pa: "ਫਸਲਾਂ ਨੂੰ ਕਦੋਂ ਪਾਣੀ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?"
    },
    {
      en: "How to control pests naturally?",
      hi: "कीटों को प्राकृतिक रूप से कैसे नियंत्रित करें?",
      te: "కీటకాలను సహజంగా ఎలా నియంత్రించాలి?",
      pa: "ਕੀੜਿਆਂ ਨੂੰ ਕੁਦਰਤੀ ਤਰੀਕੇ ਨਾਲ ਕਿਵੇਂ ਕਾਬੂ ਕਰੀਏ?"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Enhanced Header with Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroChatbot})` }}
        />
        <div className="absolute inset-0 bg-gradient-chatbot opacity-85"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="flex items-center max-w-md mx-auto w-full px-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="text-white hover:bg-white/20 mr-3 hover-lift rounded-full"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-poppins">{t('features.aiChatbot')}</h1>
                <p className="text-sm text-white/80">AI-powered farming assistant</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-6 right-8 text-white/60 animate-float">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="absolute bottom-8 left-8 text-white/40 animate-bounce-gentle">
          <MessageCircle className="h-5 w-5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-md mx-auto space-y-6 -mt-8 relative z-10">
        {/* Quick Questions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center text-chatbot flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Quick Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question[language] || question.en)}
                className="w-full text-left justify-start h-auto p-3 hover-lift"
              >
                <span className="text-sm">{question[language] || question.en}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="glass-card h-96">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-chatbot text-white'
                      : 'bg-muted text-foreground'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-4 w-4 mt-1 text-chatbot" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-4 w-4 mt-1 text-white" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.role === 'assistant' && (
                          <div className="mt-2 flex justify-end">
                            <SpeakerButton 
                              text={message.content}
                              size="sm"
                              variant="ghost"
                              className="opacity-70 hover:opacity-100"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-chatbot"></div>
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={t('chat.chatPlaceholder') || 'Ask me anything about farming...'}
                  disabled={isLoading}
                  className="pr-12"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                    isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-gradient-chatbot hover:opacity-90 h-10 w-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voice Status */}
        {isListening && (
          <Card className="glass-card border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Mic className="h-5 w-5 text-red-500 animate-pulse" />
                <span className="text-red-700 font-medium">Listening... Speak now</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-sm text-blue-700">
              💡 AI Assistant Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-600">
            <p>• Ask specific questions for better answers</p>
            <p>• Use voice input for hands-free interaction</p>
            <p>• I can help in your preferred language</p>
            <p>• Ask about crops, soil, weather, or markets</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotPage;