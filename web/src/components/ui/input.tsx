import { ComponentProps, forwardRef, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const Trigger = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={twMerge(
        "h-full w-full text-md font-normal text-gray-600 rounded-lg placeholder:text-gray-400 focus:outline-0",
        className
      )}
    />
  );
});

const Prefix = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={twMerge("h-full flex items-center text-gray-400", className)}
    />
  );
};

const Root = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={twMerge(
        "flex items-center gap-0.5 h-12 py-2 px-4 text-md font-normal text-gray-600 rounded-lg border border-gray-300 focus-within:border-blue-base focus-within:border-[1.5px] focus-within:outline-0",
        className
      )}
    />
  );
};

export const Input = { Root, Prefix, Trigger };
