import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Star, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { submitFeedback, trackUserAction } from '@/services/feedbackService';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface FeedbackFormProps {
  onClose: () => void;
  feature?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, feature }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    category: '',
    message: '',
    feature: feature || ''
  });

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    if (!formData.message.trim()) {
      toast.error('Please provide feedback message');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitFeedback({
        userId: user?.uid,
        rating: formData.rating,
        category: formData.category as any,
        message: formData.message,
        feature: formData.feature
      });

      // Track feedback submission
      trackUserAction('feedback_submitted', 'engagement', user?.uid, {
        rating: formData.rating,
        category: formData.category,
        feature: formData.feature
      });

      toast.success('Thank you for your feedback!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-bold text-center">
            Share Your Feedback
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                How would you rate your experience?
              </Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="transition-colors hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Feedback</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feature (if provided) */}
            {feature && (
              <div className="space-y-2">
                <Label htmlFor="feature" className="text-base font-medium">
                  Feature
                </Label>
                <Input
                  id="feature"
                  value={formData.feature}
                  onChange={(e) => setFormData(prev => ({ ...prev, feature: e.target.value }))}
                  placeholder="Which feature is this about?"
                />
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-medium">
                Your Feedback
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us about your experience, suggestions, or issues..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm;
