import React from 'react';
import { cn } from '../../lib/utils';

export interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'compact' | 'light';
}

export function BrandLogo({ size = 'md', variant = 'full', className, ...props }: BrandLogoProps) {
  const sizeClasses = {
    sm: { box: 'w-8 h-8 text-sm', title: 'text-xs', subtitle: 'text-[9px]' },
    md: { box: 'w-10 h-10 text-base', title: 'text-sm', subtitle: 'text-[10px]' },
    lg: { box: 'w-12 h-12 text-lg', title: 'text-base', subtitle: 'text-xs' },
  };

  const isLight = variant === 'light';

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)} {...props}>
      <div
        className={cn(
          'bg-[#FDC503] text-[#0A0A0A] font-heading font-extrabold rounded flex items-center justify-center shrink-0 shadow-xs',
          sizeClasses[size].box
        )}
      >
        GB
      </div>

      {variant !== 'compact' && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-heading font-bold leading-tight tracking-tight',
              sizeClasses[size].title,
              isLight ? 'text-white' : 'text-[#0A0A0A]'
            )}
          >
            Grupo Bairral
          </span>
          <span
            className={cn(
              'font-sans uppercase font-medium tracking-wider',
              sizeClasses[size].subtitle,
              isLight ? 'text-[#A3A3A3]' : 'text-[#737373]'
            )}
          >
            Gestão & Operações
          </span>
        </div>
      )}
    </div>
  );
}
