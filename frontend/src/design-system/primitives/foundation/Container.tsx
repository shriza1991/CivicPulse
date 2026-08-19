import React from 'react';
import { cn } from '../../../lib/utils';

export type ContainerWidth = 'page' | 'reading' | 'narrow' | 'wide' | 'full-bleed';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  gutters?: boolean;
  children: React.ReactNode;
}

const widthClasses: Record<ContainerWidth, string> = {
  'full-bleed': 'w-full max-w-full',
  narrow: 'max-w-screen-sm',
  reading: 'max-w-3xl', // ~768px reading width
  wide: 'max-w-screen-lg', // ~1024px
  page: 'max-w-screen-xl', // ~1280px
};

export const Container: React.FC<ContainerProps> = ({
  width = 'page',
  gutters = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        widthClasses[width],
        gutters && 'px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
