"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import {type VariantProps} from "class-variance-authority"

import {cn} from '../../lib/utils'
import {toggleVariants} from "../../components/ui/toggle"
import {useSignals} from "@preact/signals-react/runtime";
import {useFieldContext} from "@formsignals/form-react";
import {useComputed} from "@preact/signals-react";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

type ToggleGroupFormProps = Omit<React.ComponentPropsWithoutRef<typeof ToggleGroup>, 'value' | 'onValueChange'> & {
  className?: string;
  itemClassName?: string;
  useTransformed?: boolean;
};

const ToggleGroupForm = ({ children, className, itemClassName, useTransformed, ...props }: ToggleGroupFormProps) => {
  useSignals();
  const field = useFieldContext<string[]>();
  const errorClassName = useComputed(() => !field.isValid.value && 'border-destructive');
  const classNames = cn(className, errorClassName.value);

  const data = useTransformed ? field.transformedData : field.data
  const onChange = useTransformed ? field.handleChangeBound : field.handleChange

  return (
    <ToggleGroup
      className={classNames}
      {...props}
      value={data?.value}
      onValueChange={(e: string[]) => onChange(e)}
    >
      {children}
    </ToggleGroup>
  );
};

ToggleGroupForm.displayName = 'ToggleGroupForm';

export { ToggleGroup, ToggleGroupItem, ToggleGroupForm }
