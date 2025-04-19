import { axios } from "@/services/axios";

interface ExportUploadsOutput {
  reportUrl: string;
}

export async function ExportLinksFromStorage() {
  const response = await axios.post<ExportUploadsOutput>("/links/exports");

  return response.data;
}
