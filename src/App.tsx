import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { performanceMonitor } from "@/services/performanceService";
import LanguageSelector from "@/components/LanguageSelector";
import LoginScreen from "@/components/LoginScreen";
import OtpScreen from "@/components/OtpScreen";
import Dashboard from "@/components/Dashboard";
import SoilHealthPage from "@/components/SoilHealthPage";
import WeatherPage from "@/components/WeatherPage";
import PestDiseasePage from "@/components/PestDiseasePage";
import MarketPricesPage from "@/components/MarketPricesPage";
import ChatbotPage from "@/components/ChatbotPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentStep } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // Initialize performance monitoring
  useEffect(() => {
    performanceMonitor.startTiming('app_initialization');
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => {
      performanceMonitor.endTiming('app_initialization');
    };
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('dashboard');
  };

  if (currentStep === 'language') {
    return <LanguageSelector />;
  }

  if (currentStep === 'login') {
    return <LoginScreen />;
  }

  if (currentStep === 'otp') {
    return <OtpScreen />;
  }

  // Dashboard and feature pages
  switch (currentPage) {
    case 'soil-health':
      return <SoilHealthPage onBack={handleBack} />;
    case 'weather':
      return <WeatherPage onBack={handleBack} />;
    case 'pest-disease':
      return <PestDiseasePage onBack={handleBack} />;
    case 'market-prices':
      return <MarketPricesPage onBack={handleBack} />;
    case 'chatbot':
      return <ChatbotPage onBack={handleBack} />;
    default:
      return <Dashboard onNavigate={handleNavigate} />;
  }
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
