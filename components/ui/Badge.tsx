'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Severity } from '@/lib/types';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'risk' | 'role';
  severity?: Severity;
  size?: 'sm' | 'md';
}

export function RiskBadge({
  severity,
  size = 'md',
  className,
}: {
  severity: Severity;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const configs = {
    low: {
      label: 'Low Risk',
      icon: ShieldCheck,
      classes: 'bg-pastel-mint text-pastel-mint-dark border-pastel-mint-border',
    },
    medium: {
      label: 'Medium Risk',
      icon: AlertCircle,
      classes: 'bg-pastel-butter text-pastel-butter-dark border-pastel-butter-border',
    },
    high: {
      label: 'High Risk',
      icon: AlertTriangle,
      classes: 'bg-pastel-peach text-pastel-peach-dark border-pastel-peach-border',
    },
    critical: {
      label: 'Critical Alert',
      icon: Flame,
      classes: 'bg-pastel-rose text-pastel-rose-dark border-pastel-rose-border animate-pulse-gentle',
    },
  };

  const config = configs[severity] || configs.low;
  const Icon = config.icon;

  const sizeStyles =
    size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-3 py-1 text-xs sm:text-sm gap-1.5 font-semibold';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-sm font-medium tracking-tight select-none',
        config.classes,
        sizeStyles,
        className
      )}
      role="status"
      aria-label={`Risk Level: ${config.label}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'bg-transparent text-slate-600 border border-slate-300',
    risk: 'bg-pastel-mint text-pastel-mint-dark border-pastel-mint-border',
    role: 'bg-pastel-lavender text-pastel-lavender-dark border-pastel-lavender-border font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        sizeClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
