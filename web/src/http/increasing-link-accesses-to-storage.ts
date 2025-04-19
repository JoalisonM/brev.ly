import { Link } from "@/dtos";
import { axios } from "@/services/axios";

export async function IncreasingLinkAccessesToStorage(linkId: string) {
  const response = await axios.patch<Link>(`/links/${linkId}`);

  return response.data;
}
