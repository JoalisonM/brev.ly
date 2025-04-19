import { Link } from "@/dtos";
import { axios } from "@/services/axios";

export async function getLinkByShortUrlFromStorage(shortUrl: string) {
  const response = await axios.get<Link>(`/links/${shortUrl}`);

  return response.data;
}
