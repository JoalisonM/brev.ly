import { forwardRef, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={twMerge(
        "h-12 p-4 text-md font-normal text-gray-600 rounded-lg border border-gray-300 placeholder:text-gray-400 focus:border-blue-base focus:border-[1.5px] focus:outline-0",
        className
      )}
    />
  );
});
