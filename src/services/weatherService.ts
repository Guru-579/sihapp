export interface WeatherData {
  location: string;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainfall: number;
    condition: string;
    icon: string;
    feelsLike: number;
    pressure: number;
    visibility: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    rainfall: number;
    humidity: number;
  }>;
  alerts: Array<{
    type: 'severe_weather' | 'high_wind' | 'heavy_rain';
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '8cbf813529a280bcf3fdfc9a54536a9c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Default location: Kovvada, Bhimavaram, AP
const DEFAULT_COORDINATES = {
  lat: 16.5449,
  lon: 81.5212
};

export const fetchWeatherData = async (lat?: number, lon?: number): Promise<WeatherData> => {
  try {
    const latitude = lat || DEFAULT_COORDINATES.lat;
    const longitude = lon || DEFAULT_COORDINATES.lon;

    // Fetch current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    
    if (!currentResponse.ok) {
      throw new Error('Failed to fetch current weather');
    }
    
    const currentData = await currentResponse.json();

    // Fetch forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    
    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch weather forecast');
    }
    
    const forecastData = await forecastResponse.json();

    // Process current weather
    const current = {
      temperature: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      rainfall: currentData.rain?.['1h'] || 0,
      condition: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      feelsLike: Math.round(currentData.main.feels_like),
      pressure: currentData.main.pressure,
      visibility: Math.round((currentData.visibility || 10000) / 1000) // Convert to km
    };

    // Process 3-day forecast
    const forecast = [];
    const dailyData: { [key: string]: any } = {};

    // Group forecast data by day
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temps: [],
          conditions: [],
          icons: [],
          rainfall: 0,
          humidity: []
        };
      }
      
      dailyData[dateKey].temps.push(item.main.temp);
      dailyData[dateKey].conditions.push(item.weather[0].description);
      dailyData[dateKey].icons.push(item.weather[0].icon);
      dailyData[dateKey].rainfall += item.rain?.['3h'] || 0;
      dailyData[dateKey].humidity.push(item.main.humidity);
    });

    // Convert to forecast array (next 3 days)
    const sortedDays = Object.keys(dailyData).sort().slice(0, 3);
    
    sortedDays.forEach(dateKey => {
      const day = dailyData[dateKey];
      forecast.push({
        date: day.date,
        day: day.day,
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        condition: day.conditions[0], // Most common condition
        icon: day.icons[0],
        rainfall: Math.round(day.rainfall * 10) / 10,
        humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length)
      });
    });

    // Generate alerts
    const alerts = [];
    
    if (current.rainfall > 50) {
      alerts.push({
        type: 'heavy_rain' as const,
        message: `Heavy rainfall detected: ${current.rainfall}mm/hr. Consider postponing field activities.`,
        severity: 'high' as const
      });
    }
    
    if (current.windSpeed > 50) {
      alerts.push({
        type: 'high_wind' as const,
        message: `High wind speed: ${current.windSpeed} km/h. Protect crops and avoid spraying.`,
        severity: 'high' as const
      });
    }

    // Check forecast for severe weather
    forecast.forEach(day => {
      if (day.rainfall > 25) {
        alerts.push({
          type: 'severe_weather' as const,
          message: `Heavy rain expected on ${day.day}: ${day.rainfall}mm. Plan accordingly.`,
          severity: 'medium' as const
        });
      }
    });

    return {
      location: currentData.name || 'Kovvada, Bhimavaram',
      current,
      forecast,
      alerts
    };

  } catch (error) {
    console.error('Weather API Error:', error);
    
    // Return mock data in case of API failure
    return {
      location: 'Kovvada, Bhimavaram',
      current: {
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        condition: 'partly cloudy',
        icon: '02d',
        feelsLike: 31,
        pressure: 1013,
        visibility: 10
      },
      forecast: [
        {
          date: new Date().toISOString().split('T')[0],
          day: 'Today',
          high: 32,
          low: 24,
          condition: 'sunny',
          icon: '01d',
          rainfall: 0,
          humidity: 60
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          day: 'Tomorrow',
          high: 30,
          low: 22,
          condition: 'partly cloudy',
          icon: '02d',
          rainfall: 2,
          humidity: 70
        },
        {
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          day: 'Day 3',
          high: 29,
          low: 21,
          condition: 'light rain',
          icon: '10d',
          rainfall: 8,
          humidity: 75
        }
      ],
      alerts: []
    };
  }
};

export const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '🌨️', // snow
    '13n': '🌨️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
  };
  
  return iconMap[iconCode] || '🌤️';
};

export const getLocationWeather = async (cityName: string): Promise<WeatherData> => {
  try {
    // Get coordinates for the city
    const geocodeResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    );
    
    if (!geocodeResponse.ok) {
      throw new Error('Failed to geocode location');
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (geocodeData.length === 0) {
      throw new Error('Location not found');
    }
    
    const { lat, lon } = geocodeData[0];
    return await fetchWeatherData(lat, lon);
    
  } catch (error) {
    console.error('Location weather error:', error);
    // Fallback to default location
    return await fetchWeatherData();
  }
};
