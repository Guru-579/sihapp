import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useVoiceAssistant } from '@/services/voiceService';

interface SpeakerButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  className,
  size = 'sm',
  variant = 'ghost'
}) => {
  const { speak } = useVoiceAssistant();

  const handleSpeak = () => {
    speak(text);
  };

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleSpeak}
      className={cn(
        'rounded-full p-1',
        sizeClasses[size],
        className
      )}
      title="Read aloud"
    >
      <Volume2 className={iconSizes[size]} />
    </Button>
  );
};

export default SpeakerButton;