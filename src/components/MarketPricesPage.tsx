import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/services/voiceService';
import SpeakerButton from '@/components/ui/speaker-button';
import { ArrowLeft, TrendingUp, MapPin, RefreshCw, Clock, TrendingDown, Phone, Calendar, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getMarketPrices, 
  getAvailableCommodities, 
  getAvailableDistricts,
  getNearbyMarkets,
  getNearestMarkets,
  formatPrice,
  MarketPrice 
} from '@/services/marketPricesService';

interface MarketPricesPageProps {
  onBack: () => void;
}

const MarketPricesPage: React.FC<MarketPricesPageProps> = ({ onBack }) => {
  const { language } = useLanguageContext();
  const { t } = useTranslation();
  const { speak } = useVoiceAssistant();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [nearbyMarkets, setNearbyMarkets] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showNearbyMarkets, setShowNearbyMarkets] = useState(false);

  const crops = getAvailableCommodities();
  const districts = getAvailableDistricts();

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          // Automatically fetch nearby markets
          fetchNearbyMarkets(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.info('Location access denied. Showing all markets.');
        }
      );
    }
  }, []);

  // Fetch nearby markets based on location
  const fetchNearbyMarkets = async (latitude: number, longitude: number) => {
    try {
      const nearby = await getNearestMarkets(latitude, longitude, 100); // 100km radius
      setNearbyMarkets(nearby);
      
      if (nearby.length > 0) {
        const announcement = `Found ${nearby.length} markets near you. Nearest market is ${nearby[0].market} at ${nearby[0].distance?.toFixed(1)} kilometers.`;
        speak(announcement);
      }
    } catch (error) {
      console.error('Error fetching nearby markets:', error);
    }
  };

  // Fetch market prices
  const fetchMarketPrices = async () => {
    try {
      setIsLoading(true);
      const data = await getMarketPrices(selectedCrop, selectedDistrict);
      setMarketPrices(data.prices);
      setLastUpdated(data.lastUpdated);
      
      if (data.prices.length === 0) {
        toast.info('No market data found for selected filters');
      }
    } catch (error) {
      toast.error('Failed to fetch market prices');
      console.error('Market prices error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchMarketPrices();
  }, []);

  // Refresh data when filters change
  useEffect(() => {
    if (selectedCrop || selectedDistrict) {
      fetchMarketPrices();
    }
  }, [selectedCrop, selectedDistrict]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-market text-white p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-2" />
            <h1 className="text-lg font-bold">{t('marketPrices')}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('selectCrop')}</label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose crop..." />
              </SelectTrigger>
              <SelectContent>
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('selectDistrict')}</label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose district..." />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nearby Markets Toggle */}
        {userLocation && nearbyMarkets.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant={showNearbyMarkets ? "default" : "outline"}
              onClick={() => setShowNearbyMarkets(!showNearbyMarkets)}
              className="flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              {showNearbyMarkets ? 'Show All Markets' : `Show Nearby Markets (${nearbyMarkets.length})`}
            </Button>
          </div>
        )}

        {/* Nearby Markets Section */}
        {showNearbyMarkets && nearbyMarkets.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearest Markets
              </CardTitle>
              <SpeakerButton 
                text={`Showing ${nearbyMarkets.length} nearest markets. Closest market is ${nearbyMarkets[0]?.market} at ${nearbyMarkets[0]?.distance?.toFixed(1)} kilometers.`}
                size="sm"
              />
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyMarkets.slice(0, 3).map((market, index) => (
                <div key={market.id} className="p-3 rounded-lg bg-white border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-blue-800">{market.market}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={market.marketStatus === 'open' ? 'default' : 'secondary'}
                        className={market.marketStatus === 'open' ? 'bg-green-500' : 'bg-gray-500'}
                      >
                        {market.marketStatus}
                      </Badge>
                      <SpeakerButton 
                        text={`${market.market} in ${market.district}. Distance: ${market.distance?.toFixed(1)} kilometers. ${market.commodity} price: ${market.modalPrice} rupees per ${market.unit}.`}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      <span>{market.distance?.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{market.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>₹{market.modalPrice}/{market.unit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{market.marketDays?.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    {market.commodity} - {market.variety} | {market.district}, {market.state}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Refresh Button */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchMarketPrices}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {lastUpdated && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Market Prices Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-market-prices flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Mandi Prices
            </CardTitle>
            {marketPrices.length > 0 && (
              <SpeakerButton 
                text={`Market prices for ${marketPrices.length} items. ${marketPrices[0].commodity} is priced at ${marketPrices[0].modalPrice} rupees per ${marketPrices[0].unit} in ${marketPrices[0].market}.`}
                size="sm"
              />
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 mx-auto mb-4 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Loading market prices...</p>
              </div>
            ) : marketPrices.length > 0 ? (
              <div className="space-y-4">
                {marketPrices.map((price) => (
                  <div key={price.id} className="border rounded-lg p-4 space-y-2 relative">
                    <SpeakerButton 
                      text={`${price.commodity} ${price.variety} in ${price.market}, ${price.district}. Modal price: ${price.modalPrice} rupees per ${price.unit}. Minimum: ${price.minPrice}, Maximum: ${price.maxPrice}.`}
                      className="absolute top-2 right-2"
                      size="sm"
                    />
                    <div className="flex justify-between items-start pr-8">
                      <div>
                        <h4 className="font-semibold text-lg">{price.commodity}</h4>
                        <p className="text-sm text-muted-foreground">{price.variety}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">
                          {formatPrice(price.modalPrice, price.unit)}
                        </p>
                        <p className="text-xs text-muted-foreground">Modal Price</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-red-500">
                        Min: {formatPrice(price.minPrice, price.unit)}
                      </span>
                      <span className="text-blue-500">
                        Max: {formatPrice(price.maxPrice, price.unit)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {price.market}, {price.district}
                      </span>
                      <span>{price.priceDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {selectedCrop || selectedDistrict 
                    ? 'No prices found for selected filters' 
                    : t('marketData')
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nearby Markets */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-center text-sm flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-1" />
              Nearby Markets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {nearbyMarkets.length > 0 ? (
              nearbyMarkets.map((market) => (
                <div key={market.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{market.market}</p>
                    <p className="text-xs text-muted-foreground">{market.district}, {market.state}</p>
                    <p className="text-xs text-muted-foreground">{market.marketDays?.join(', ') || 'Contact for hours'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{market.distance?.toFixed(1)} km</p>
                    <p className={`text-xs ${market.marketStatus === 'open' ? 'text-green-600' : 'text-red-500'}`}>
                      {market.marketStatus === 'open' ? 'Open' : 'Closed'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Loading nearby markets...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketPricesPage;