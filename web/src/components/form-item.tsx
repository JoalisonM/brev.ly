import { Warning } from "@phosphor-icons/react";
import { ComponentProps } from "react";
import { FieldError } from "react-hook-form";

interface FormItemProps extends ComponentProps<"div"> {
  error: FieldError | undefined;
}

export function FormItem({ children, error, ...props }: FormItemProps) {
  return (
    <div
      {...props}
      className="group flex flex-col gap-2"
      data-status={error ? "error" : "valid"}
    >
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
