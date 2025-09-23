import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FeedbackForm from '@/components/FeedbackForm';
import FloatingActionButton from '@/components/ui/floating-action-button';
import NotificationBadge from '@/components/ui/notification-badge';
import SpeakerButton from '@/components/ui/speaker-button';
import { usePageTracking, useAnalytics } from '@/hooks/useAnalytics';
import { useVoiceAssistant, VoiceMessages } from '@/services/voiceService';
import { fetchWeatherData, WeatherData } from '@/services/weatherService';
import { 
  User, 
  Bell, 
  Leaf, 
  Cloud, 
  Bug, 
  TrendingUp, 
  MessageCircle,
  Mic,
  Sparkles,
  Star,
  MessageSquare,
  AlertTriangle,
  CloudRain
} from 'lucide-react';

// Import hero images
import heroSoil from '@/assets/hero-soil.jpg';
import heroWeather from '@/assets/hero-weather.jpg';
import heroPest from '@/assets/hero-pest.jpg';
import heroMarket from '@/assets/hero-market.jpg';
import heroChatbot from '@/assets/hero-chatbot.jpg';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { language } = useLanguageContext();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { trackFeature } = useAnalytics();
  const { speak } = useVoiceAssistant();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([]);
  const [hasWeatherAlert, setHasWeatherAlert] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);

  // Track page view
  usePageTracking('dashboard');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Request location and fetch weather data
  useEffect(() => {
    const requestLocationAndWeather = async () => {
      if (!locationPermissionRequested) {
        setLocationPermissionRequested(true);
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const weatherData = await fetchWeatherData(latitude, longitude);
                setCurrentWeather(weatherData);
                
                // Check for severe weather conditions
                const alerts = [];
                const weather = weatherData.current;
                
                // Temperature alerts
                if (weather.temperature > 40) {
                  alerts.push({
                    type: 'heat',
                    message: 'Extreme heat warning - protect crops from heat stress',
                    severity: 'high'
                  });
                } else if (weather.temperature < 5) {
                  alerts.push({
                    type: 'cold',
                    message: 'Cold wave warning - protect crops from frost',
                    severity: 'high'
                  });
                }
                
                // Wind alerts
                if (weather.windSpeed > 25) {
                  alerts.push({
                    type: 'wind',
                    message: 'High wind warning - secure crops and equipment',
                    severity: 'medium'
                  });
                }
                
                // Rain alerts
                if (weather.condition.toLowerCase().includes('rain') && weather.humidity > 80) {
                  alerts.push({
                    type: 'rain',
                    message: 'Heavy rain expected - ensure proper drainage',
                    severity: 'medium'
                  });
                }
                
                // Use weather service alerts if available
                if (weatherData.alerts && weatherData.alerts.length > 0) {
                  alerts.push(...weatherData.alerts);
                }
                
                setWeatherAlerts(alerts);
                setHasWeatherAlert(alerts.length > 0);
                
                // Speak weather alert if present
                if (alerts.length > 0) {
                  const alertMessage = VoiceMessages.weatherAlert?.[language] || 'Weather alert';
                  speak(alertMessage + '. ' + alerts[0].message);
                }
              } catch (error) {
                console.error('Error fetching weather data:', error);
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              // Fallback to default location weather
              fetchWeatherData().then(setCurrentWeather).catch(console.error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
          );
        } else {
          // Fallback if geolocation is not supported
          fetchWeatherData().then(setCurrentWeather).catch(console.error);
        }
      }
    };

    requestLocationAndWeather();
    
    // Refresh weather every 30 minutes
    const weatherInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const weatherData = await fetchWeatherData(latitude, longitude);
            setCurrentWeather(weatherData);
          },
          () => {
            fetchWeatherData().then(setCurrentWeather).catch(console.error);
          }
        );
      }
    }, 30 * 60 * 1000);
    
    return () => clearInterval(weatherInterval);
  }, [language, speak, locationPermissionRequested]);

  const features = [
    {
      id: 'soil-health',
      title: t('features.soilHealth'),
      icon: Leaf,
      gradient: 'bg-gradient-soil',
      heroImage: heroSoil,
      description: 'Analyze soil health & nutrients',
      className: 'feature-card-soil',
    },
    {
      id: 'weather',
      title: t('features.weather'),
      icon: Cloud,
      gradient: 'bg-gradient-weather',
      heroImage: heroWeather,
      description: 'Live weather & forecasts',
      className: 'feature-card-weather',
    },
    {
      id: 'pest-disease',
      title: t('features.pestDisease'),
      icon: Bug,
      gradient: 'bg-gradient-pest',
      heroImage: heroPest,
      description: 'Detect pests & diseases',
      className: 'feature-card-pest',
    },
    {
      id: 'market-prices',
      title: t('features.marketPrices'),
      icon: TrendingUp,
      gradient: 'bg-gradient-market',
      heroImage: heroMarket,
      description: 'Live market prices',
      className: 'feature-card-market',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Enhanced Header with Glassmorphism */}
      <div className="bg-gradient-to-r from-primary via-green-600 to-emerald-600 text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="flex items-center justify-between max-w-md mx-auto relative z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout} 
              className="text-white hover:bg-white/20 hover-lift rounded-full p-3"
            >
              <User className="h-6 w-6" />
            </Button>
            <LanguageSwitcher variant="ghost" size="sm" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Sparkles className="h-4 w-4 mr-1 text-yellow-300 animate-pulse" />
              <h1 className="text-xl font-bold font-poppins">{t('dashboard.dashboard')}</h1>
              {hasWeatherAlert && (
                <div className="ml-2 relative">
                  <AlertTriangle className="h-5 w-5 text-red-400 animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                </div>
              )}
              <Sparkles className="h-4 w-4 ml-1 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-sm opacity-90 font-medium">{t('dashboard.welcome')}</p>
            <p className="text-xs opacity-75 mt-1">
              {currentTime.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN')}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 hover-lift rounded-full p-3 relative"
            onClick={() => {
              if (weatherAlerts.length > 0) {
                const alertsText = weatherAlerts.map(alert => alert.message).join('. ');
                speak(`Weather alerts: ${alertsText}`);
              } else {
                speak('No weather alerts at this time');
              }
            }}
          >
            <Bell className="h-6 w-6" />
            {hasWeatherAlert && (
              <>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
              </>
            )}
          </Button>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-2 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute bottom-3 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce-gentle"></div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-md mx-auto pb-24">
        {/* Weather and Market Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="glass-card hover-lift">
            <CardContent className="p-4 text-center relative">
              <SpeakerButton 
                text={`Current temperature is ${currentWeather?.current?.temperature || 'loading'} degrees celsius in ${currentWeather?.location || 'your area'}`}
                className="absolute top-1 right-1"
                size="sm"
              />
              <Cloud className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-xs text-muted-foreground mb-1">Weather</p>
              <p className="font-bold text-lg">{currentWeather?.current?.temperature || '--'}°C</p>
              <p className="text-xs text-muted-foreground">{currentWeather?.location || 'Loading...'}</p>
              <p className="text-xs text-blue-600 capitalize">{currentWeather?.current?.condition || ''}</p>
            </CardContent>
          </Card>
          <Card className="glass-card hover-lift">
            <CardContent className="p-4 text-center relative">
              <SpeakerButton 
                text="Market conditions are good with rising prices"
                className="absolute top-1 right-1"
                size="sm"
              />
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-xs text-muted-foreground mb-1">Market</p>
              <p className="font-bold text-lg">↗ Good</p>
              <p className="text-xs text-green-600">Rising Prices</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards with Hero Images */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              className={`cursor-pointer border-0 shadow-xl hover-lift ${feature.className} overflow-hidden group animate-scale-in`}
              onClick={() => {
                trackFeature(feature.id, { title: feature.title });
                onNavigate(feature.id);
              }}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0 relative">
                {/* Hero Image Background */}
                <div 
                  className="h-32 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${feature.heroImage})` }}
                >
                  <div className={`absolute inset-0 ${feature.gradient} opacity-85`}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <feature.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-sm mb-1 group-hover:scale-105 transition-transform">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-white/80 font-medium">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      {/* Enhanced Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Pulse Rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-chatbot opacity-20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-chatbot opacity-30 animate-pulse"></div>
          
          <Button
            onClick={() => {
              trackFeature('chatbot', { source: 'floating_button' });
              onNavigate('chatbot');
            }}
            size="lg"
            className="h-16 w-16 rounded-full bg-gradient-chatbot shadow-2xl hover:scale-110 transition-all duration-300 relative feature-card-chatbot group"
          >
            <div className="flex flex-col items-center">
              <MessageCircle className="h-6 w-6 group-hover:animate-bounce" />
              <Mic className="h-4 w-4 -mt-1 group-hover:animate-pulse" />
            </div>
          </Button>
          
          {/* Notification Badge */}
          <NotificationBadge count={1} show={true}>
            <div></div>
          </NotificationBadge>
        </div>
      </div>

      {/* Feedback Floating Action Button */}
      <FloatingActionButton
        onClick={() => setShowFeedbackForm(true)}
        icon={<MessageSquare className="h-6 w-6" />}
        position="bottom-left"
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      />

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm onClose={() => setShowFeedbackForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;