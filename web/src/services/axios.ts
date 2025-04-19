import InternalError from "@/errors/internal-error";
import ResourceNotFoundError from "@/errors/resource-not-found-error";
import ShortLinkAlreadyExistsError from "@/errors/short-link-already-exists-error";
import Axios, { AxiosError } from "axios";

export const axios = Axios.create({
  baseURL: "http://localhost:3333",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

const err = (error: AxiosError) => {
  if (error && error.response && error.response.status) {
    switch (error.response.status) {
      case 409:
        throw new ShortLinkAlreadyExistsError({
          message: "A URL encurtada já existe.",
        });
      case 404:
        throw new ResourceNotFoundError({
          message: "Recurso não encontrado.",
        });
      case 500:
        throw new InternalError({ message: "Erro interno do servidor." });
      default:
        return Promise.reject(error.response);
    }
  }

  return Promise.reject(error);
};

axios.interceptors.request.use((config) => {
  return config;
}, err);

axios.interceptors.response.use((response) => response, err);
