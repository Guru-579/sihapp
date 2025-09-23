import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Eye,
  Droplets,
  Wind,
  Thermometer,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  location: string;
}

interface WeatherWidgetProps {
  data: WeatherData;
  className?: string;
  compact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  data, 
  className,
  compact = false 
}) => {
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    } else if (lowerCondition.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="h-8 w-8 text-gray-400" />;
    } else if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
      return <CloudLightning className="h-8 w-8 text-purple-500" />;
    } else {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 35) return 'text-red-500';
    if (temp > 25) return 'text-orange-500';
    if (temp > 15) return 'text-green-500';
    return 'text-blue-500';
  };

  if (compact) {
    return (
      <Card className={cn('bg-gradient-to-br from-blue-50 to-indigo-100', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(data.condition)}
              <div>
                <p className={cn('text-2xl font-bold', getTemperatureColor(data.temperature))}>
                  {data.temperature}°C
                </p>
                <p className="text-sm text-muted-foreground">{data.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{data.location}</p>
              <div className="flex items-center gap-1 mt-1">
                <Droplets className="h-3 w-3 text-blue-400" />
                <span className="text-xs">{data.humidity}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('bg-gradient-to-br from-blue-50 to-indigo-100', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{data.location}</h3>
            <p className="text-sm text-muted-foreground">Current Weather</p>
          </div>
          <Badge variant="secondary" className="bg-white/50">
            Live
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {getWeatherIcon(data.condition)}
          <div>
            <p className={cn('text-4xl font-bold', getTemperatureColor(data.temperature))}>
              {data.temperature}°C
            </p>
            <p className="text-muted-foreground capitalize">{data.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{data.humidity}%</p>
              <p className="text-xs text-muted-foreground">Humidity</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">{data.windSpeed} km/h</p>
              <p className="text-xs text-muted-foreground">Wind</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">{data.pressure} hPa</p>
              <p className="text-xs text-muted-foreground">Pressure</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium">{data.visibility} km</p>
              <p className="text-xs text-muted-foreground">Visibility</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
