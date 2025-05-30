import { Check } from "@phosphor-icons/react";
import { useState } from "react";

import { Button, ButtonProps } from "./ui/button";
import { toast } from "sonner";

interface CopyToClipboardButtonProps extends ButtonProps {
  text: string;
  successMessage: string;
}

export function CopyToClipboardButton({
  children,
  text,
  successMessage,
  ...props
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.info(successMessage);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button {...props} onClick={() => copyToClipboard(text)}>
      {!copied && children}
      {copied && <Check size={16} />}
    </Button>
  );
}
