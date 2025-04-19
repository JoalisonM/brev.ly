import { Copy, Trash } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { useLinks } from "@/store/links";
import { Link as LinkProps } from "@/dtos";
import { CopyToClipboardButton } from "./copy-to-clipboard-button";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LinkItemProps {
  link: LinkProps;
}

export function LinkItem({ link }: LinkItemProps) {
  const deleteLink = useLinks((store) => store.deleteLink);

  async function onDeleteLink() {
    await deleteLink(link.id);
  }

  const shortUrl = link.shortUrl.split("/")[1];

  return (
    <motion.div
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border-b border-gray-200 last:border-0"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -8,
          scale: 0.98,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          y: 8,
          scale: 0.98,
          filter: "blur(4px)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="grid grid-cols-[minmax(7rem,_22rem)_1fr_1fr] items-center gap-4 py-3 lg:py-4"
      >
        <div className="flex flex-col gap-1">
          <Link
            to={shortUrl}
            target="_blank"
            className="text-md text-blue-base truncate"
          >
            {link.shortUrl}
          </Link>
          <span className="text-sm tex-gray-500 truncate">{link.url}</span>
        </div>

        <span className="text-sm text-gray-500 text-nowrap">
          {link.clicks} {link.clicks === 1 ? "acesso" : "acessos"}
        </span>

        <div className="flex items-center justify-center gap-1">
          <CopyToClipboardButton variant="icon" text={link.shortUrl}>
            <Copy size={16} />
          </CopyToClipboardButton>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="icon">
                <Trash size={16} />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Você realmente quer apagar o link "{shortUrl}"?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteLink}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </motion.div>
  );
}
