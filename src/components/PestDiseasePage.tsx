import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/services/voiceService';
import SpeakerButton from '@/components/ui/speaker-button';
import { ArrowLeft, Camera, Upload, Bug, AlertTriangle, CheckCircle, Leaf, Eye, Shield, Zap, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { detectPestDisease, PestDiseaseResult } from '@/services/pestDiseaseService';
import { performEnhancedPestDiseaseAnalysis, DetailedPestDiseaseResult, generateTreatmentPlan } from '@/services/enhancedPestDiseaseService';

interface PestDiseasePageProps {
  onBack: () => void;
}

const PestDiseasePage: React.FC<PestDiseasePageProps> = ({ onBack }) => {
  const { language } = useLanguageContext();
  const { t } = useTranslation();
  const { speak } = useVoiceAssistant();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetailedPestDiseaseResult | null>(null);
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

  const handleImageAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    try {
      toast.info('Analyzing crop image... This may take a few moments.');
      
      // Perform enhanced analysis
      const enhancedResult = await performEnhancedPestDiseaseAnalysis(file, undefined, userLocation);
      
      if (enhancedResult.success) {
        setResult(enhancedResult);
        toast.success('Detailed analysis completed!');
        
        // Voice announcement
        const announcement = `Analysis complete. Detected ${enhancedResult.disease} with ${Math.round(enhancedResult.confidence * 100)}% confidence. Disease stage is ${enhancedResult.detailedAnalysis.diseaseStage}. ${enhancedResult.detailedAnalysis.affectedArea}% of the plant is affected.`;
        speak(announcement);
      } else {
        toast.error(enhancedResult.error || 'Failed to analyze image');
      }
    } catch (error) {
      toast.error('Error analyzing image');
      console.error('Pest/Disease analysis error:', error);
    } finally {
      setIsAnalyzing(false);
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
      handleImageAnalysis(file);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Leaf className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-pest text-white p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center">
            <Bug className="h-6 w-6 mr-2" />
            <h1 className="text-lg font-bold">{t('pestDisease')}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleCameraCapture}
            disabled={isAnalyzing}
            className="h-16 bg-gradient-pest text-white hover:opacity-90"
          >
            <div className="flex flex-col items-center">
              <Camera className={`h-6 w-6 mb-1 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">
                {isAnalyzing ? 'Analyzing...' : t('captureImage')}
              </span>
            </div>
          </Button>
          <Button 
            onClick={handleFileUpload}
            disabled={isAnalyzing}
            variant="outline" 
            className="h-16 border-pest-disease text-pest-disease hover:bg-pest-disease/10"
          >
            <div className="flex flex-col items-center">
              <Upload className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">{t('uploadImage')}</span>
            </div>
          </Button>
        </div>

        {/* Results Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-pest-disease">
              Disease & Pest Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            {isAnalyzing ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-pest rounded-full flex items-center justify-center animate-pulse">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-pest-disease font-bold">Analyzing crop image...</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-pest h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Detection Result */}
                <div className={`p-4 rounded-lg border ${getSeverityColor(result.severity)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(result.severity)}
                      <h3 className="font-bold text-lg">{result.disease}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Confidence</span>
                      <p className="font-bold">{Math.round(result.confidence * 100)}%</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    result.category === 'healthy' ? 'bg-green-100 text-green-700' :
                    result.category === 'disease' ? 'bg-red-100 text-red-700' :
                    result.category === 'pest' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {result.category.toUpperCase()}
                  </div>
                </div>

                {/* Disease Analysis Details */}
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Disease Analysis
                    </CardTitle>
                    <SpeakerButton 
                      text={`Disease analysis: ${result.detailedAnalysis.diseaseStage} stage, ${result.detailedAnalysis.affectedArea}% affected area, ${result.detailedAnalysis.spreadRisk} spread risk, ${result.detailedAnalysis.urgency} urgency level.`}
                      size="sm"
                    />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-red-600 font-medium">Disease Stage</p>
                        <Badge 
                          className={
                            result.detailedAnalysis.diseaseStage === 'critical' ? 'bg-red-600' :
                            result.detailedAnalysis.diseaseStage === 'severe' ? 'bg-red-500' :
                            result.detailedAnalysis.diseaseStage === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                          }
                        >
                          {result.detailedAnalysis.diseaseStage.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-red-600 font-medium">Affected Area</p>
                        <div className="flex items-center gap-2">
                          <Progress value={result.detailedAnalysis.affectedArea} className="flex-1" />
                          <span className="text-sm font-bold">{result.detailedAnalysis.affectedArea}%</span>
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-red-600 font-medium">Spread Risk</p>
                        <Badge 
                          variant={result.detailedAnalysis.spreadRisk === 'high' ? 'destructive' : 
                                  result.detailedAnalysis.spreadRisk === 'medium' ? 'secondary' : 'outline'}
                        >
                          {result.detailedAnalysis.spreadRisk.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-red-600 font-medium">Urgency</p>
                        <Badge 
                          className={
                            result.detailedAnalysis.urgency === 'critical' ? 'bg-red-600' :
                            result.detailedAnalysis.urgency === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                          }
                        >
                          {result.detailedAnalysis.urgency.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Immediate Treatment */}
                {result.treatment.immediate.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-orange-800 flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Immediate Treatment
                      </CardTitle>
                      <SpeakerButton 
                        text={`Immediate treatment steps: ${result.treatment.immediate.map(t => t.action).join(', ')}`}
                        size="sm"
                      />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.treatment.immediate.map((treatment, index) => (
                        <div key={index} className="p-3 bg-white rounded border border-orange-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-orange-800">Step {treatment.step}</h4>
                            <Badge className="bg-orange-500">
                              {treatment.effectiveness}/10 effective
                            </Badge>
                          </div>
                          <p className="text-sm text-orange-700 mb-2">{treatment.action}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-orange-600">
                            <div><strong>Materials:</strong> {treatment.materials.join(', ')}</div>
                            <div><strong>Frequency:</strong> {treatment.frequency}</div>
                            <div><strong>Duration:</strong> {treatment.duration}</div>
                            {treatment.cost && <div><strong>Cost:</strong> {treatment.cost}</div>}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Prevention Methods */}
                {result.prevention.culturalPractices.length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-green-800 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Prevention Methods
                      </CardTitle>
                      <SpeakerButton 
                        text={`Prevention methods include: ${result.prevention.culturalPractices.slice(0, 3).join(', ')}`}
                        size="sm"
                      />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-white rounded border border-green-200">
                        <h4 className="font-bold text-green-800 mb-2">Cultural Practices</h4>
                        {result.prevention.culturalPractices.map((practice, index) => (
                          <div key={index} className="flex items-start gap-2 mb-1">
                            <span className="text-green-500 mt-1">•</span>
                            <p className="text-sm text-green-700">{practice}</p>
                          </div>
                        ))}
                      </div>
                      {result.prevention.biologicalControl.length > 0 && (
                        <div className="p-3 bg-white rounded border border-green-200">
                          <h4 className="font-bold text-green-800 mb-2">Biological Control</h4>
                          {result.prevention.biologicalControl.map((control, index) => (
                            <div key={index} className="flex items-start gap-2 mb-1">
                              <span className="text-green-500 mt-1">•</span>
                              <p className="text-sm text-green-700">{control}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Economic Impact */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-purple-800 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Economic Impact
                    </CardTitle>
                    <SpeakerButton 
                      text={`Economic impact: ${result.economicImpact.potentialLoss}. Treatment cost: ${result.economicImpact.treatmentCost}. Recovery time: ${result.economicImpact.recoveryTime}.`}
                      size="sm"
                    />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-purple-600 font-medium">Potential Loss</p>
                        <p className="text-purple-800">{result.economicImpact.potentialLoss}</p>
                      </div>
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-purple-600 font-medium">Treatment Cost</p>
                        <p className="text-purple-800">{result.economicImpact.treatmentCost}</p>
                      </div>
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-purple-600 font-medium">Recovery Time</p>
                        <p className="text-purple-800">{result.economicImpact.recoveryTime}</p>
                      </div>
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-purple-600 font-medium">Market Impact</p>
                        <p className="text-purple-800">{result.economicImpact.marketImpact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Bug className="h-16 w-16 mx-auto text-muted-foreground animate-float" />
                <p className="text-muted-foreground text-lg">
                  {t('pestResults')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Capture or upload a crop image to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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

        {/* Quick Tips */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-center text-sm">
              Quick Prevention Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Check plants regularly for early signs</p>
            <p>• Maintain proper plant spacing</p>
            <p>• Use organic pest control methods</p>
            <p>• Keep the field clean of debris</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PestDiseasePage;