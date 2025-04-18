import { axios } from "../services/axios";

export function deleteLinkToStorage(id: string) {
  return axios.delete(`/links/${id}`);
}
