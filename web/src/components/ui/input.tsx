import { InputHTMLAttributes } from "react";

export const Input = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className="h-12 p-4 text-md font-normal text-gray-600 rounded-lg border border-gray-300 placeholder:text-gray-400 focus:border-blue-base focus:border-[1.5px] focus:outline-0"
    />
  );
};
