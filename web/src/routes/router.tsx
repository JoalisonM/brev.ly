import { createBrowserRouter } from "react-router-dom";

import { Links } from "../pages/app/links";
import { NotFound } from "../pages/not-found";
import { Redirect } from "../pages/app/redirect";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Links />,
  },
  {
    path: "/:shortUrl",
    element: <Redirect />,
  },
  {
    path: "/url/not-found",
    element: <NotFound />,
  },
]);
