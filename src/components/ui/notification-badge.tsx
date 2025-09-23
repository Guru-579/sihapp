import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count?: number;
  show?: boolean;
  className?: string;
  children: React.ReactNode;
  maxCount?: number;
  dot?: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count = 0,
  show = true,
  className,
  children,
  maxCount = 99,
  dot = false
}) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const shouldShow = show && (count > 0 || dot);

  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      {shouldShow && (
        <span className={cn(
          'absolute -top-2 -right-2 flex items-center justify-center',
          'bg-red-500 text-white text-xs font-bold rounded-full',
          'animate-pulse',
          dot ? 'h-3 w-3' : 'min-h-5 min-w-5 px-1'
        )}>
          {!dot && displayCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;
