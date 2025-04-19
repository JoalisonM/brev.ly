import { axios } from "@/services/axios";

export async function deleteLinkToStorage(linkId: string) {
  return await axios.delete(`/links/${linkId}`);
}
