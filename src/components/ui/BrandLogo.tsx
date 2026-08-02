import React from 'react';
import { cn } from '../../lib/utils';

export interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'compact' | 'light';
}

export function BairralEmblemSvg({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="26 12 48 88" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M61.5 18L74 12V34C74 49 63 57 48 63C33 69 26 77 26 88V100L38.5 94V79C38.5 71 45.5 64 59 58C61.5 52 61.5 35 61.5 18Z"
        fill="#FDC503"
      />
    </svg>
  );
}

export function BrandLogo({ size = 'md', variant = 'full', className, ...props }: BrandLogoProps) {
  const sizeClasses = {
    sm: { box: 'h-6', icon: 'h-6 w-auto', title: 'text-xs', subtitle: 'text-[9px]' },
    md: { box: 'h-8', icon: 'h-8 w-auto', title: 'text-sm', subtitle: 'text-[10px]' },
    lg: { box: 'h-10', icon: 'h-10 w-auto', title: 'text-base', subtitle: 'text-xs' },
  };

  const isLight = variant === 'light';

  return (
    <div className={cn('flex items-center gap-2.5 select-none group', className)} {...props}>
      <div className={cn('flex items-center justify-center shrink-0 transition-transform group-hover:scale-105', sizeClasses[size].box)}>
        <BairralEmblemSvg className={sizeClasses[size].icon} />
      </div>

      {variant !== 'compact' && (
        <div className="flex flex-col justify-center">
          <span
            className={cn(
              'font-heading font-extrabold leading-tight tracking-tight whitespace-nowrap',
              sizeClasses[size].title,
              isLight ? 'text-white' : 'text-[#0A0A0A]'
            )}
          >
            Grupo Bairral
          </span>
          <span
            className={cn(
              'font-sans uppercase font-extrabold tracking-[0.16em] whitespace-nowrap mt-1',
              sizeClasses[size].subtitle,
              isLight ? 'text-white' : 'text-[#0A0A0A]'
            )}
          >
            Gestão & Operações
          </span>
        </div>
      )}
    </div>
  );
}


