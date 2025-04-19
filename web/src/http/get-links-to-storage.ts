import { axios } from "@/services/axios";
import { GetLinksParams, LinksData } from "@/dtos";

export async function getLinksToStorage({
  page,
  sortBy,
  pageSize,
  sortDirection,
}: GetLinksParams): Promise<LinksData> {
  const response = await axios.get<LinksData>("/links", {
    params: {
      page,
      sortBy,
      pageSize,
      sortDirection,
    },
  });

  return response.data;
}
