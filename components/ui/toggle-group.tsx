"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleGroupVariants>>({
  size: "default",
  variant: "default",
})

const toggleGroupVariants = cva("flex items-center justify-center rounded-md", {
  variants: {
    variant: {
      default: "bg-transparent",
      outline: "border border-input",
    },
    size: {
      default: "h-10",
      sm: "h-9",
      lg: "h-11",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleGroupVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupContext.Provider value={{ variant, size }}>
    <ToggleGroupPrimitive.Root ref={ref} className={cn(toggleGroupVariants({ variant, size }), className)} {...props}>
      {children}
    </ToggleGroupPrimitive.Root>
  </ToggleGroupContext.Provider>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

export { ToggleGroup, toggleGroupVariants, ToggleGroupContext }
