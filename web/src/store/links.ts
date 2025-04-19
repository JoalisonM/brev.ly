import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";

import { CreateLinkParams, GetLinksParams } from "@/dtos";
import { addLinkToStorage } from "@/http/add-link-to-storage";
import { getLinksToStorage } from "@/http/get-links-to-storage";
import { deleteLinkToStorage } from "@/http/delete-link-to-storage";
import { getLinkByShortUrlToStorage } from "@/http/get-link-by-short-url-to-storage";
import { IncreasingLinkAccessesToStorage } from "@/http/increasing-link-accesses-to-storage";

export type Link = {
  id: string;
  url: string;
  clicks: number;
  shortUrl: string;
  createdAt: string;
};

type LinksState = {
  link: Link;
  isLoadingLinks: boolean;
  links: Map<string, Link>;
  deleteLink: (linkId: string) => Promise<void>;
  countAccesses: (linkId: string) => Promise<void>;
  addLink: (data: CreateLinkParams) => Promise<void>;
  getLinks: (params: GetLinksParams) => Promise<void>;
  getLinkByShortUrl: (shortUrl: string) => Promise<void>;
};

enableMapSet();

export const useLinks = create<LinksState, [["zustand/immer", never]]>(
  immer((set, get) => {
    const link = {} as Link;
    const isLoadingLinks = false;

    async function getLinks(params: GetLinksParams) {
      set((state) => {
        state.isLoadingLinks = true;
      });

      const result = await getLinksToStorage(params);

      set((state) => {
        result.links.forEach((link) => {
          state.links.set(link.id, link);
        });
        state.isLoadingLinks = false;
      });
    }

    async function getLinkByShortUrl(shortUrl: string) {
      const link = await getLinkByShortUrlToStorage(shortUrl);

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

      await deleteLinkToStorage(linkId);

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

    return {
      link,
      addLink,
      getLinks,
      deleteLink,
      isLoadingLinks,
      countAccesses,
      links: new Map(),
      getLinkByShortUrl,
    };
  })
);
