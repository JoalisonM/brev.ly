import { DownloadSimple } from "@phosphor-icons/react";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";

import { Button } from "./ui/button";
import { EmptyList } from "./empty-list";
import { useLinks } from "@/store/links";
import { LinkItem } from "./link-item";
import { LoadingList } from "./loading-list";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LinkList() {
  const links = useLinks((store) => store.links);
  const getLinks = useLinks((store) => store.getLinks);
  const isLoadingLinks = useLinks((store) => store.isLoadingLinks);

  useEffect(() => {
    getLinks({});
  }, []);

  return (
    <div data-loading={isLoadingLinks} className="flex flex-col w-full">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 lg:pb-5">
        <h1 className="text-lg">Meus links</h1>

        <Button variant="secondary" type="button" disabled={true}>
          <DownloadSimple className="h-4 w-4 text-gray-600" />
          <span>Baixar CSV</span>
        </Button>
      </div>

      {isLoadingLinks && <LoadingList />}

      {!isLoadingLinks && links.size === 0 && <EmptyList />}

      <ScrollArea className="grid grid-cols-1 max-h-[calc(100dvh-33rem)] lg:max-h-[calc(100dvh-20rem)] divide-y divide-gray-200">
        <div className="divide-y divide-gray-200">
          <AnimatePresence initial={false}>
            {Array.from(links.entries()).map(([linkId, link]) => (
              <LinkItem key={linkId} link={link} />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
