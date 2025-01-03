import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import { Loader, Loader2 } from 'lucide-react';
import type React from 'react';

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

interface SpinnerContentProps extends VariantProps<typeof spinnerVariants>, VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
  variant?: 1 | 2;
}

export function Spinner({ size, show, children, className, variant = 2 }: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show })}>
      {variant === 2 ? (
        <Loader2 className={cn(loaderVariants({ size }), className)} />
      ) : (
        <Loader className={cn(loaderVariants({ size }), className)} />
      )}
      {children}
    </span>
  );
}
