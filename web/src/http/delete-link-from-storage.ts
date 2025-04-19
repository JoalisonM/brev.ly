import { axios } from "@/services/axios";

export async function deleteLinkFromStorage(linkId: string) {
  return await axios.delete(`/links/${linkId}`);
}
