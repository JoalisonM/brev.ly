import { DownloadSimple, Spinner } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";

import { Button } from "./ui/button";
import { LinkItem } from "./link-item";
import { EmptyList } from "./empty-list";
import { useLinks } from "@/store/links";
import { LoadingList } from "./loading-list";
import { downloadUrl } from "@/utils/download-url";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LinkList() {
  const links = useLinks((store) => store.links);
  const getLinks = useLinks((store) => store.getLinks);
  const exportLinks = useLinks((store) => store.exportLinks);
  const isLoadingExportLinks = useLinks((store) => store.isLoadingExportLinks);

  const { isLoading } = useQuery({
    queryKey: ["links"],
    queryFn: () => getLinks({}),
  });

  async function handleDownloadFile() {
    const reportUrl = await exportLinks();

    if (reportUrl) downloadUrl(reportUrl);
  }

  return (
    <div data-loading={isLoading} className="flex flex-col w-full">
      <div className="flex items-center justify-between pb-4 lg:pb-5">
        <h1 className="text-lg">Meus links</h1>

        <Button
          type="button"
          variant="secondary"
          disabled={links.size === 0 || isLoadingExportLinks}
          onClick={() => handleDownloadFile()}
        >
          {isLoadingExportLinks && (
            <Spinner className="h-4 w-4 text-gray-600 animate-spin" />
          )}
          {!isLoadingExportLinks && (
            <DownloadSimple className="h-4 w-4 text-gray-600" />
          )}
          <span>Baixar CSV</span>
        </Button>
      </div>

      {isLoading && <LoadingList />}

      {!isLoading && links.size === 0 && <EmptyList />}

      <ScrollArea className="grid grid-cols-1 max-h-[calc(100dvh-33rem)] lg:max-h-[calc(100dvh-20rem)]">
        <AnimatePresence initial={false}>
          {Array.from(links.entries()).map(([linkId, link]) => (
            <LinkItem key={linkId} link={link} />
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
