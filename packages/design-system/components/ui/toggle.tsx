'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../../lib/utils'
import {useSignals} from "@preact/signals-react/runtime";
import {useFieldContext} from "@formsignals/form-react";
import {useComputed} from "@preact/signals-react";

const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-2 min-w-9',
        sm: 'h-8 px-1.5 min-w-8',
        lg: 'h-10 px-2.5 min-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

type ToggleFormProps = Omit<React.ComponentPropsWithoutRef<typeof Toggle>, 'value' | 'onValueChange'> & {
  className?: string;
  useTransformed?: boolean;
};

const ToggleForm = ({ className, useTransformed, ...props }: ToggleFormProps) => {
  useSignals();
  const field = useFieldContext<boolean>();
  const errorClassName = useComputed(() => !field.isValid.value && 'border-destructive');
  const classNames = cn(className, errorClassName.value);

  const data = useTransformed ? field.transformedData : field.data;
  const onChange = useTransformed ? field.handleChangeBound : field.handleChange;

  return (
    <Toggle
      className={classNames}
      {...props}
      pressed={data?.value}
      onPressedChange={(e: boolean) => onChange(e)}
    />
  );
};

ToggleForm.displayName = 'ToggleForm';

export { Toggle, ToggleForm, toggleVariants }
