import Axios from "axios";

export const axios = Axios.create({
  baseURL: "http://localhost:3333",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});
