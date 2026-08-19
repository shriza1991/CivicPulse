import React from 'react';
import { cn } from '../../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'image';
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  circle = false,
  className,
  style,
  ...props
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded-sm',
    card: 'h-32 w-full rounded-md',
    avatar: 'w-10 h-10 rounded-pill',
    button: 'h-12 w-28 rounded-md',
    image: 'h-48 w-full rounded-md',
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-neutral-200 animate-pulse select-none',
        variantClasses[variant],
        circle && 'rounded-pill',
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};
