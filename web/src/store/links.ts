import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";

import { CreateLinkParams, GetLinksParams } from "../dtos";
import { addLinkToStorage } from "../http/add-link-to-storage";
import { getLinksToStorage } from "../http/get-links-to-storage";
import { deleteLinkToStorage } from "../http/delete-link-to-storage";

export type Link = {
  id: string;
  url: string;
  clicks: number;
  shortUrl: string;
  createdAt: string;
};

type LinksState = {
  links: Map<string, Link>;
  deleteLink: (linkId: string) => Promise<void>;
  addLink: (data: CreateLinkParams) => Promise<void>;
  getLinks: (params: GetLinksParams) => Promise<void>;
};

enableMapSet();

export const useLinks = create<LinksState, [["zustand/immer", never]]>(
  immer((set, get) => {
    async function getLinks(params: GetLinksParams) {
      const result = await getLinksToStorage(params);

      set((state) => {
        result.links.forEach((link) => {
          state.links.set(link.id, link);
        });
      });
    }

    async function addLink({ url, shortUrl }: CreateLinkParams) {
      const newLink = await addLinkToStorage({ url, shortUrl });

      set((state) => {
        state.links.set(newLink.id, newLink);
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

    return {
      addLink,
      getLinks,
      deleteLink,
      links: new Map(),
    };
  })
);
