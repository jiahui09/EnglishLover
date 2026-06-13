import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type CardVariant = 'default' | 'subtle' | 'outlined';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({ variant = 'default', className, ...props }: CardProps) {
  return <div className={cn('el-card', `el-card--${variant}`, className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('el-card__section', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('el-card__title', className)} {...props} />;
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn('el-card__description', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('el-card__section pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('el-card__section border-el-border border-t', className)} {...props} />;
}
