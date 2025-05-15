import { axios } from "@/services/axios";
import { GetLinksParams, LinksData } from "@/dtos";

export async function getLinksFromStorage({
  sortBy,
  sortDirection,
}: GetLinksParams): Promise<LinksData> {
  const response = await axios.get<LinksData>("/links", {
    params: {
      sortBy,
      sortDirection,
    },
  });

  return response.data;
}
