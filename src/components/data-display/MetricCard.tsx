import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from './Card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
  highlightColor?: 'yellow' | 'neutral' | 'success' | 'danger' | 'info';
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  highlightColor = 'yellow',
  className,
}: MetricCardProps) {
  const iconBgClasses = {
    yellow: 'bg-[#FFF4C2] text-[#806300]',
    neutral: 'bg-[#F5F5F5] text-[#171717]',
    success: 'bg-[#DCFCE7] text-[#15803D]',
    danger: 'bg-[#FEE2E2] text-[#B91C1C]',
    info: 'bg-[#DBEAFE] text-[#1D4ED8]',
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
            {title}
          </span>
          <span className="font-heading font-extrabold text-2xl text-[#0A0A0A] font-tabular mt-1">
            {value}
          </span>
        </div>
        {IconComponent && (
          <div className={cn('p-2.5 rounded-md shrink-0', iconBgClasses[highlightColor])}>
            <IconComponent className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-[#F5F5F5] flex items-center justify-between text-[11px]">
          {trend && (
            <span
              className={cn(
                'font-semibold font-tabular',
                trend.isPositive && 'text-[#16A34A]',
                trend.isNegative && 'text-[#DC2626]',
                !trend.isPositive && !trend.isNegative && 'text-[#525252]'
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-[#737373]">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
