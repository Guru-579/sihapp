import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  disabled?: boolean;
  pulse?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  className,
  position = 'bottom-right',
  size = 'md',
  variant = 'default',
  disabled = false,
  pulse = false
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'bottom-center': 'fixed bottom-6 left-1/2 transform -translate-x-1/2'
  };

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14',
    lg: 'h-16 w-16'
  };

  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={cn(
        positionClasses[position],
        sizeClasses[size],
        'rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50',
        'hover:scale-110 active:scale-95',
        pulse && 'animate-pulse',
        className
      )}
    >
      {icon}
    </Button>
  );
};

export default FloatingActionButton;
