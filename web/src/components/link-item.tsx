import { Copy, Trash } from "@phosphor-icons/react";

import { Link } from "../dtos";
import { Button } from "./ui/button";
import { useLinks } from "../store/links";

interface LinkItemProps {
  link: Link;
}

export function LinkItem({ link }: LinkItemProps) {
  const deleteLink = useLinks((store) => store.deleteLink);

  async function onDeleteLink() {
    await deleteLink(link.id);
  }

  return (
    <div className="grid grid-cols-[minmax(7rem,_22rem)_1fr_1fr] items-center gap-4 py-3">
      <div className="flex flex-col">
        <span className="text-md text-blue-base truncate">{link.shortUrl}</span>
        <span className="text-sm tex-gray-500 truncate">{link.url}</span>
      </div>

      <span className="text-sm text-gray-500 text-nowrap">
        {link.clicks} {link.clicks === 1 ? "acesso" : "acessos"}
      </span>

      <div className="flex items-center justify-center gap-1">
        <Button variant="icon">
          <Copy size={16} />
        </Button>
        <Button variant="icon" onClick={onDeleteLink}>
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
}
