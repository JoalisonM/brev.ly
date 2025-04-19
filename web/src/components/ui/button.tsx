import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { type VariantProps, tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-x-1.5 h-12 bg-blue-base text-white text-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none",

  variants: {
    variant: {
      default: "px-5 rounded-lg w-full hover:bg-blue-dark",
      outline: "text-gray-500 px-5 bg-transparent border border-gray-200",
      secondary:
        "bg-gray-200 h-8 rounded-[0.25rem] px-2 text-gray-500 border border-gray-200 hover:border hover:border-blue-base",
      icon: "h-8 w-8 bg-gray-200 rounded-[0.25rem] text-gray-600 border border-gray-200 hover:border hover:border-blue-base",
    },
  },

  defaultVariants: {
    variant: "default",
  },
});

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ variant, className, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component className={buttonVariants({ variant, className })} {...props} />
  );
}
