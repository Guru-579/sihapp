import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface SpeakerButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  className,
  size = 'md',
  variant = 'ghost'
}) => {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to set a voice that supports the current language
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') || voice.default
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
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