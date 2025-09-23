import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/utils/translations';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { ArrowLeft, Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, AlertTriangle, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { fetchWeatherData, getWeatherIcon, WeatherData } from '@/services/weatherService';
import heroWeather from '@/assets/hero-weather.jpg';

interface WeatherPageProps {
  onBack: () => void;
}

const WeatherPage: React.FC<WeatherPageProps> = ({ onBack }) => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const data = await fetchWeatherData();
      setWeatherData(data);
      
      // Check for severe weather alerts
      if (data.alerts.length > 0) {
        data.alerts.forEach(alert => {
          if (alert.severity === 'high') {
            toast.warning(alert.message);
          }
        });
      }
    } catch (error) {
      toast.error('Failed to load weather data');
      console.error('Weather error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadWeatherData();
    setIsRefreshing(false);
    toast.success('Weather data updated!');
  };

  const getWeatherIconComponent = (iconCode: string) => {
    const iconMap: { [key: string]: any } = {
      '01d': Sun, '01n': Sun,
      '02d': Cloud, '02n': Cloud,
      '03d': Cloud, '03n': Cloud,
      '04d': Cloud, '04n': Cloud,
      '09d': CloudRain, '09n': CloudRain,
      '10d': CloudRain, '10n': CloudRain,
      '11d': CloudRain, '11n': CloudRain,
      '13d': Cloud, '13n': Cloud,
      '50d': Cloud, '50n': Cloud
    };
    
    return iconMap[iconCode] || Sun;
  };

  const getWeatherColor = (iconCode: string) => {
    if (iconCode.includes('01')) return 'text-yellow-500';
    if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) return 'text-blue-500';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <Cloud className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-pulse" />
          <p className="text-lg font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Enhanced Header with Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroWeather})` }}
        />
        <div className="absolute inset-0 bg-gradient-weather opacity-85"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
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
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-poppins">{t('weather')}</h1>
                <p className="text-sm text-white/80">Live weather updates</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Weather Elements */}
        <div className="absolute top-6 right-8 text-white/60 animate-float">
          <Sun className="h-6 w-6" />
        </div>
        <div className="absolute bottom-8 left-8 text-white/40 animate-bounce-gentle">
          <CloudRain className="h-5 w-5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-md mx-auto space-y-6 -mt-8 relative z-10">
        {/* Current Weather Card */}
        <Card className="glass-card feature-card-weather">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <p className="text-sm text-muted-foreground">{weatherData?.location}</p>
                <p className="text-3xl font-bold text-weather">{weatherData?.current.temperature}°C</p>
                <p className="text-sm text-muted-foreground">Feels like {weatherData?.current.feelsLike}°C</p>
              </div>
              <div className="text-right">
                {weatherData && (() => {
                  const IconComponent = getWeatherIconComponent(weatherData.current.icon);
                  return <IconComponent className={`h-16 w-16 ${getWeatherColor(weatherData.current.icon)} animate-float mx-auto mb-2`} />;
                })()}
                <p className="text-sm font-medium capitalize">{weatherData?.current.condition}</p>
                <p className="text-xs text-muted-foreground">{getWeatherIcon(weatherData?.current.icon || '')}</p>
              </div>
            </div>
            
            {/* Weather Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <Droplets className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-bold text-sm">{weatherData?.current.humidity}%</p>
              </div>
              <div className="text-center">
                <Wind className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-bold text-sm">{weatherData?.current.windSpeed} km/h</p>
              </div>
              <div className="text-center">
                <Eye className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                <p className="text-xs text-muted-foreground">Visibility</p>
                <p className="font-bold text-sm">{weatherData?.current.visibility} km</p>
              </div>
            </div>

            {weatherData?.current.rainfall && weatherData.current.rainfall > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <CloudRain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">
                    Rainfall: {weatherData.current.rainfall}mm/hr
                  </span>
                </div>
              </div>
            )}

            <Button 
              onClick={handleRefresh}
              variant="outline" 
              size="sm" 
              className="mt-4 hover-lift"
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </CardContent>
        </Card>

        {/* 3-Day Forecast */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center text-weather">
              3-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherData?.forecast.map((forecast, index) => {
              const IconComponent = getWeatherIconComponent(forecast.icon);
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-6 w-6 ${getWeatherColor(forecast.icon)}`} />
                    <div>
                      <p className="font-medium">{forecast.day}</p>
                      <p className="text-xs text-muted-foreground capitalize">{forecast.condition}</p>
                      {forecast.rainfall > 0 && (
                        <p className="text-xs text-blue-500">Rain: {forecast.rainfall}mm</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{forecast.high}°/{forecast.low}°</p>
                    <p className="text-xs text-muted-foreground">{getWeatherIcon(forecast.icon)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Weather Alerts */}
        {weatherData && weatherData.alerts.length > 0 && (
          <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-center text-red-600 flex items-center justify-center">
                <Bell className="h-5 w-5 mr-2" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weatherData.alerts.map((alert, index) => (
                <div key={index} className="text-center py-3">
                  {alert.type === 'heavy_rain' && <CloudRain className="h-8 w-8 mx-auto mb-2 text-blue-500 animate-pulse" />}
                  {alert.type === 'high_wind' && <Wind className="h-8 w-8 mx-auto mb-2 text-red-500 animate-pulse" />}
                  {alert.type === 'severe_weather' && <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500 animate-pulse" />}
                  
                  <p className={`font-medium mb-2 ${
                    alert.severity === 'high' ? 'text-red-600' :
                    alert.severity === 'medium' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`}>
                    {alert.message}
                  </p>
                  
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {alert.severity.toUpperCase()} PRIORITY
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Farming Recommendations */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-sm text-blue-700">
              🌱 Farming Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-600">
            <p>• Perfect weather for outdoor activities</p>
            <p>• Good day for harvesting and spraying</p>
            <p>• Consider irrigation before tomorrow's rain</p>
            <p>• UV levels high - protect yourself and plants</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherPage;