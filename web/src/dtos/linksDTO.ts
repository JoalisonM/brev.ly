export interface CreateLinkParams {
  url: string;
  shortUrl: string;
}

export interface Link {
  id: string;
  url: string;
  clicks: number;
  shortUrl: string;
  createdAt: string;
}

export interface LinksData {
  links: Link[];
  total: number;
}

export interface GetLinksParams {
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt";
  sortDirection?: "asc" | "desc";
}
