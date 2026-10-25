import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatPercent(num: number): string {
  return `${Math.round(num * 100)}%`;
}

export function getRiskBadgeClasses(severity: 'low' | 'medium' | 'high' | 'critical') {
  switch (severity) {
    case 'low':
      return 'bg-pastel-mint text-pastel-mint-dark border-pastel-mint-border';
    case 'medium':
      return 'bg-pastel-butter text-pastel-butter-dark border-pastel-butter-border';
    case 'high':
      return 'bg-pastel-peach text-pastel-peach-dark border-pastel-peach-border';
    case 'critical':
      return 'bg-pastel-rose text-pastel-rose-dark border-pastel-rose-border animate-pulse-gentle';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
