
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

export function getRatingColor(rating: string): string {
  switch(rating) {
    case 'excellent':
      return 'bg-green-500';
    case 'good':
      return 'bg-blue-500';
    case 'average':
      return 'bg-yellow-500';
    case 'below_average':
      return 'bg-orange-500';
    case 'poor':
      return 'bg-red-500';
    case 'pending':
    default:
      return 'bg-gray-400';
  }
}

export function getStatusBadgeColor(status: string): string {
  switch(status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800';
    case 'screening':
      return 'bg-purple-100 text-purple-800';
    case 'interview':
      return 'bg-yellow-100 text-yellow-800';
    case 'assessment':
      return 'bg-indigo-100 text-indigo-800';
    case 'offer':
      return 'bg-green-100 text-green-800';
    case 'hired':
      return 'bg-emerald-100 text-emerald-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
