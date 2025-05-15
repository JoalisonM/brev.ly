import { forwardRef, LabelHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={twMerge(
        "text-gray-500 text-xs group-focus-within:text-blue-base group-focus-within:font-medium group-data-[status=error]:text-danger group-data-[status=error]:font-medium",
        className
      )}
      {...props}
    />
  );
});
