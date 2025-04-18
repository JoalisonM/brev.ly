import { useEffect } from "react";
import { DownloadSimple } from "@phosphor-icons/react";

import { Button } from "./ui/button";
import { EmptyList } from "./empty-list";
import { useLinks } from "../store/links";
import { LinkItem } from "./link-item";

export function LinkList() {
  const links = useLinks((store) => store.links);
  const getLinks = useLinks((store) => store.getLinks);

  useEffect(() => {
    getLinks({});
  }, [getLinks]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 lg:pb-5">
        <h1 className="text-lg">Meus links</h1>

        <Button variant="secondary" type="button" disabled={true}>
          <DownloadSimple className="h-4 w-4 text-gray-600" />
          <span>Baixar CSV</span>
        </Button>
      </div>

      {links.size === 0 && <EmptyList />}

      <div className="grid grid-cols-1 divide-y divide-gray-200">
        {Array.from(links.entries()).map(([linkId, link]) => (
          <LinkItem key={linkId} link={link} />
        ))}
      </div>
    </div>
  );
}
