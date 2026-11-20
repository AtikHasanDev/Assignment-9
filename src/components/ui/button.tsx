'use client';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

type Variant = 'primary' | 'secondary' | 'danger';
// DaisyUI controls with Radix Slot composition for accessible link buttons.
export const buttonVariants = cva('d-btn fm-button', { variants: { variant: { primary: 'd-btn-primary', secondary: 'd-btn-outline', danger: 'd-btn-error' } }, defaultVariants: { variant: 'primary' } });
const classes = (variant: Variant, className = '') => buttonVariants({ variant, className });

export function Button({ variant = 'primary', className, type = 'button', asChild = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; asChild?: boolean }) {
  const Component = asChild ? Slot : 'button';
  return <Component data-slot="button" type={asChild ? undefined : type} className={classes(variant, className)} {...props} />;
}

export function ButtonLink({ variant = 'primary', className, ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Button asChild variant={variant} className={className}><Link {...props} /></Button>;
}

