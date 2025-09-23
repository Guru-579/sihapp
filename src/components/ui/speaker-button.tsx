import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useVoiceAssistant } from '@/services/voiceService';
import { cn } from '@/lib/utils';

interface SpeakerButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  disabled?: boolean;
  language?: string;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  className,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  language,
  onSpeakStart,
  onSpeakEnd
}) => {
  const { speak, stop, isSpeaking, isSupported } = useVoiceAssistant();
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = async () => {
    if (!isSupported || disabled || !text.trim()) {
      return;
    }

    if (isCurrentlySpeaking) {
      // Stop current speech
      stop();
      setIsCurrentlySpeaking(false);
      onSpeakEnd?.();
      return;
    }

    try {
      setIsLoading(true);
      setIsCurrentlySpeaking(true);
      onSpeakStart?.();

      await speak(text, language);
      
      setIsCurrentlySpeaking(false);
      onSpeakEnd?.();
    } catch (error) {
      console.error('Speech error:', error);
      setIsCurrentlySpeaking(false);
      onSpeakEnd?.();
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className={cn(iconSizes[size], 'animate-spin')} />;
    }
    
    if (isCurrentlySpeaking) {
      return <VolumeX className={cn(iconSizes[size], 'text-red-500')} />;
    }
    
    return <Volume2 className={cn(iconSizes[size], 'text-blue-500')} />;
  };

  if (!isSupported) {
    return null; // Don't render if speech synthesis is not supported
  }

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(
        sizeClasses[size],
        'rounded-full transition-all duration-200',
        'hover:scale-110 active:scale-95',
        isCurrentlySpeaking && 'animate-pulse bg-red-50 hover:bg-red-100',
        className
      )}
      onClick={handleClick}
      disabled={disabled || isLoading}
      title={isCurrentlySpeaking ? 'Stop speaking' : 'Read aloud'}
    >
      {getIcon()}
    </Button>
  );
};

export default SpeakerButton;
