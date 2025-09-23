import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/services/voiceService';
import SpeakerButton from '@/components/ui/speaker-button';
import { ArrowLeft, Camera, Upload, Leaf, Zap, BarChart3, Eye, CheckCircle, AlertTriangle, XCircle, MapPin, TrendingUp, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { performOCR, SoilHealthData } from '@/services/ocrService';
import { generateFertilizerRecommendations, FertilizerAnalysis } from '@/services/fertilizerService';
import { generateEnhancedSoilAnalysis, EnhancedSoilAnalysis } from '@/services/cropRecommendationService';
import heroSoil from '@/assets/hero-soil.jpg';

interface SoilHealthPageProps {
  onBack: () => void;
}

const SoilHealthPage = ({ onBack }: SoilHealthPageProps) => {
  const { language } = useLanguageContext();
  const { t } = useTranslation();
  const { speak } = useVoiceAssistant();
  const [isScanning, setIsScanning] = useState(false);
  const [soilData, setSoilData] = useState<SoilHealthData | null>(null);
  const [analysis, setAnalysis] = useState<FertilizerAnalysis | null>(null);
  const [enhancedAnalysis, setEnhancedAnalysis] = useState<EnhancedSoilAnalysis | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleImageUpload = async (file: File) => {
    setIsScanning(true);
    try {
      toast.info('Processing image... This may take a few moments.');
      const result = await performOCR(file);
      
      if (result.success) {
        setSoilData(result.soilData);
        setOcrText(result.text);
        const fertilizerAnalysis = generateFertilizerRecommendations(result.soilData);
        setAnalysis(fertilizerAnalysis);
        
        // Generate enhanced analysis with crop recommendations
        const enhanced = await generateEnhancedSoilAnalysis(result.soilData, userLocation);
        setEnhancedAnalysis(enhanced);
        
        toast.success('Soil analysis completed!');
        
        // Voice announcement
        const announcement = `Soil analysis complete. Your soil pH is ${result.soilData.pH}. We found ${enhanced.cropRecommendations.length} suitable crops for your soil.`;
        speak(announcement);
      } else {
        toast.error(result.error || 'Failed to analyze image');
      }
    } catch (error) {
      toast.error('Error processing image');
      console.error('OCR Error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fair':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'poor':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Leaf className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Enhanced Header with Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSoil})` }}
        />
        <div className="absolute inset-0 bg-gradient-soil opacity-85"></div>
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
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-poppins">{t('soilHealth')}</h1>
                <p className="text-sm text-white/80">Advanced soil analysis</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/10 rounded-full animate-bounce-gentle"></div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-md mx-auto space-y-6 -mt-8 relative z-10">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleCameraCapture}
            disabled={isScanning}
            className="h-20 bg-gradient-soil text-white hover:opacity-90 hover-lift feature-card-soil rounded-xl border-0 shadow-xl"
          >
            <div className="flex flex-col items-center">
              <Camera className={`h-8 w-8 mb-2 ${isScanning ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-bold">
                {isScanning ? 'Scanning...' : t('captureImage')}
              </span>
            </div>
          </Button>
          <Button 
            onClick={handleFileUpload}
            disabled={isScanning}
            variant="outline" 
            className="h-20 border-2 border-soil-health/30 text-soil-health hover:bg-soil-health/10 hover-lift rounded-xl shadow-lg glass-card"
          >
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 mb-2" />
              <span className="text-sm font-bold">{t('uploadFile')}</span>
            </div>
          </Button>
        </div>

        {/* Location-based Information */}
        {userLocation && (
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle className="text-center text-soil-health flex items-center justify-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Analysis based on your current location
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <span>Lat: {userLocation.latitude.toFixed(4)}</span>
                <span>Lng: {userLocation.longitude.toFixed(4)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Area with Analysis */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-soil-health flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Soil Analysis Results
            </CardTitle>
            {enhancedAnalysis && (
              <SpeakerButton 
                text={`Soil analysis results: pH ${enhancedAnalysis.soilHealth.pH}, Nitrogen ${enhancedAnalysis.soilHealth.nitrogen}, Phosphorus ${enhancedAnalysis.soilHealth.phosphorus}, Potassium ${enhancedAnalysis.soilHealth.potassium}. Top recommended crops: ${enhancedAnalysis.cropRecommendations.slice(0, 3).map(c => c.name).join(', ')}`}
                size="sm"
              />
            )}
          </CardHeader>
          <CardContent className="text-center py-6">
            {isScanning ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-soil rounded-full flex items-center justify-center animate-pulse">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-soil-health font-bold">Analyzing soil sample...</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-soil h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : analysis ? (
              <div className="space-y-4 text-left">
                {/* Overall Status */}
                <div className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-muted/50">
                  {getStatusIcon(analysis.overall_status)}
                  <span className="font-bold capitalize">{analysis.overall_status} Soil Health</span>
                </div>
                
                {/* Summary */}
                <p className="text-sm text-muted-foreground text-center">{analysis.summary}</p>
                
                {/* Soil Data Display */}
                {soilData && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {soilData.pH && (
                      <div className="bg-blue-50 p-2 rounded">
                        <span className="font-bold">pH:</span> {soilData.pH}
                      </div>
                    )}
                    {soilData.nitrogen && (
                      <div className="bg-green-50 p-2 rounded">
                        <span className="font-bold">N:</span> {soilData.nitrogen}
                      </div>
                    )}
                    {soilData.phosphorus && (
                      <div className="bg-orange-50 p-2 rounded">
                        <span className="font-bold">P:</span> {soilData.phosphorus}
                      </div>
                    )}
                    {soilData.potassium && (
                      <div className="bg-purple-50 p-2 rounded">
                        <span className="font-bold">K:</span> {soilData.potassium}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Leaf className="h-16 w-16 mx-auto text-muted-foreground animate-float" />
                <p className="text-muted-foreground text-lg">
                  Upload Soil Health Card
                </p>
                <p className="text-sm text-muted-foreground">
                  Capture or upload an image to get detailed analysis and crop recommendations
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fertilizer Recommendations */}
        {analysis && analysis.recommendations.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-center text-soil-health flex items-center justify-center">
                <Zap className="h-5 w-5 mr-2" />
                Fertilizer Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{rec.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm">{rec.category}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rec.issue}</p>
                      <p className="text-xs font-medium">{rec.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Crop Recommendations */}
        {enhancedAnalysis && enhancedAnalysis.cropRecommendations.length > 0 && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-soil-health flex items-center">
                <Leaf className="h-5 w-5 mr-2" />
                Recommended Crops
              </CardTitle>
              <SpeakerButton 
                text={`Based on your soil analysis, we recommend these crops: ${enhancedAnalysis.cropRecommendations.slice(0, 4).map(c => `${c.name} with ${c.suitability} suitability`).join(', ')}`}
                size="sm"
              />
            </CardHeader>
            <CardContent className="space-y-3">
              {enhancedAnalysis.cropRecommendations.slice(0, 6).map((crop, index) => (
                <div key={index} className="p-3 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-800">{crop.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={crop.suitability === 'excellent' ? 'default' : 
                                crop.suitability === 'good' ? 'secondary' : 'outline'}
                        className={
                          crop.suitability === 'excellent' ? 'bg-green-500' :
                          crop.suitability === 'good' ? 'bg-blue-500' :
                          crop.suitability === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                        }
                      >
                        {crop.suitability}
                      </Badge>
                      <SpeakerButton 
                        text={`${crop.name}: ${crop.suitability} suitability. ${crop.reason}. Expected yield: ${crop.expectedYield}. Season: ${crop.season}.`}
                        size="sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-green-700 mb-2">{crop.reason}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      <span>Yield: {crop.expectedYield}</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="h-3 w-3 mr-1 text-blue-600" />
                      <span>Water: {crop.waterRequirement}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 mr-1 bg-orange-400 rounded-full"></span>
                      <span>Season: {crop.season}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 mr-1 bg-purple-400 rounded-full"></span>
                      <span>Market: {crop.marketDemand}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Location-based Recommendations */}
        {enhancedAnalysis && enhancedAnalysis.locationRecommendations && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-soil-health flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Regional Advice
              </CardTitle>
              <SpeakerButton 
                text={`Regional advice for ${enhancedAnalysis.locationRecommendations.region}: ${enhancedAnalysis.locationRecommendations.seasonalAdvice}`}
                size="sm"
              />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-1">Climate: {enhancedAnalysis.locationRecommendations.climate}</h4>
                <p className="text-xs text-blue-700">{enhancedAnalysis.locationRecommendations.seasonalAdvice}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-1">Market Information</h4>
                <p className="text-xs text-purple-700">{enhancedAnalysis.locationRecommendations.localMarketInfo}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fertilizer and Irrigation Advice */}
        {enhancedAnalysis && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-soil-health flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Detailed Recommendations
              </CardTitle>
              <SpeakerButton 
                text={`Fertilizer advice: ${enhancedAnalysis.fertilizerAdvice.primary.join(', ')}. Irrigation method: ${enhancedAnalysis.irrigationAdvice.method}`}
                size="sm"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Primary Fertilizers */}
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">Primary Fertilizers</h4>
                {enhancedAnalysis.fertilizerAdvice.primary.map((fertilizer, index) => (
                  <p key={index} className="text-xs text-green-700 mb-1">• {fertilizer}</p>
                ))}
              </div>
              
              {/* Organic Recommendations */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2">Organic Amendments</h4>
                {enhancedAnalysis.fertilizerAdvice.organic.map((organic, index) => (
                  <p key={index} className="text-xs text-amber-700 mb-1">• {organic}</p>
                ))}
              </div>
              
              {/* Irrigation Advice */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">Irrigation Guidelines</h4>
                <p className="text-xs text-blue-700 mb-1">• Method: {enhancedAnalysis.irrigationAdvice.method}</p>
                <p className="text-xs text-blue-700 mb-1">• Frequency: {enhancedAnalysis.irrigationAdvice.frequency}</p>
                <p className="text-xs text-blue-700">• Best Time: {enhancedAnalysis.irrigationAdvice.timing}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-center text-sm text-green-700">
              💡 Pro Tips for Better Soil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-green-600">
            <p>• Test soil during dry weather for accuracy</p>
            <p>• Sample from multiple spots in your field</p>
            <p>• Regular testing improves crop yield by 15-20%</p>
            <p>• Best time: Early morning or late evening</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoilHealthPage;