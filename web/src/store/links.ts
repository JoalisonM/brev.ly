import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";

import { CreateLinkParams, GetLinksParams, LinksData } from "@/dtos";
import { addLinkToStorage } from "@/http/add-link-to-storage";
import { getLinksFromStorage } from "@/http/get-links-from-storage";
import { deleteLinkFromStorage } from "@/http/delete-link-from-storage";
import { getLinkByShortUrlFromStorage } from "@/http/get-link-by-short-url-from-storage";
import { IncreasingLinkAccessesToStorage } from "@/http/increasing-link-accesses-to-storage";
import { ExportLinksFromStorage } from "@/http/export-links-fom-storage";

export type Link = {
  id: string;
  url: string;
  clicks: number;
  shortUrl: string;
  createdAt: string;
};

type LinksState = {
  link: Link;
  links: Map<string, Link>;
  isLoadingExportLinks: boolean;
  exportLinks: () => Promise<string>;
  deleteLink: (linkId: string) => Promise<void>;
  countAccesses: (linkId: string) => Promise<void>;
  addLink: (data: CreateLinkParams) => Promise<void>;
  getLinkByShortUrl: (shortUrl: string) => Promise<void>;
  getLinks: (params: GetLinksParams) => Promise<LinksData>;
};

enableMapSet();

export const useLinks = create<LinksState, [["zustand/immer", never]]>(
  immer((set, get) => {
    const link = {} as Link;
    const isLoadingExportLinks = false;

    async function getLinks(params: GetLinksParams) {
      const result = await getLinksFromStorage(params);

      set((state) => {
        result.links.forEach((link) => {
          state.links.set(link.id, link);
        });
      });

      return result;
    }

    async function getLinkByShortUrl(shortUrl: string) {
      const link = await getLinkByShortUrlFromStorage(shortUrl);

      set((state) => {
        state.link = link;
      });
    }

    async function addLink({ url, shortUrl }: CreateLinkParams) {
      const newLink = await addLinkToStorage({ url, shortUrl });

      set((state) => {
        const updated = new Map<string, Link>();
        updated.set(newLink.id, newLink);

        state.links.forEach((value, key) => {
          updated.set(key, value);
        });

        state.links = updated;
      });
    }

    async function deleteLink(linkId: string) {
      const link = get().links.get(linkId);
      if (!link) return;

      await deleteLinkFromStorage(linkId);

      set((state) => {
        state.links.delete(linkId);
      });
    }

    async function countAccesses(linkId: string) {
      const link = await IncreasingLinkAccessesToStorage(linkId);

      set((state) => {
        state.links.set(linkId, link);
      });
    }

    async function exportLinks() {
      set((state) => {
        state.isLoadingExportLinks = true;
      });

      const response = await ExportLinksFromStorage();

      set((state) => {
        state.isLoadingExportLinks = false;
      });

      return response.reportUrl;
    }

    return {
      link,
      addLink,
      getLinks,
      deleteLink,
      exportLinks,
      countAccesses,
      links: new Map(),
      getLinkByShortUrl,
      isLoadingExportLinks,
    };
  })
);
