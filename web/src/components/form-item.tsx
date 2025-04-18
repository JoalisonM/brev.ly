import { Warning } from "@phosphor-icons/react";
import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface FormItemProps {
  label: string;
  children: ReactNode;
  error: FieldError | undefined;
}

export function FormItem({ children, error, label }: FormItemProps) {
  return (
    <div
      className="group flex flex-col gap-2"
      data-status={error ? "error" : "valid"}
    >
      <label
        htmlFor="original-link"
        className="text-gray-500 text-xs group-focus-within:text-blue-base group-focus-within:font-medium group-data-[status=error]:text-danger group-data-[status=error]:font-medium"
      >
        {label}
      </label>
      {children}
      {error?.message && (
        <div className="flex items-center gap-1">
          <Warning className="w-4 h-4 text-danger" />
          <span className="text-xs text-gray-500">{error?.message}</span>
        </div>
      )}
    </div>
  );
}
