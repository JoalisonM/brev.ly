import { Link } from "@/store/links";
import { axios } from "@/services/axios";
import { CreateLinkParams } from "@/dtos";

export async function addLinkToStorage({
  url,
  shortUrl,
}: CreateLinkParams): Promise<Link> {
  const response = await axios.post<Link>("/links", {
    url,
    shortUrl,
  });

  return response.data;
}
