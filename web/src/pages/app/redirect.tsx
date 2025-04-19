import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useLinks } from "@/store/links";
import LogoIcon from "@/assets/Logo_Icon.svg";
import ResourceNotFoundError from "@/errors/resource-not-found-error";

export function Redirect() {
  const navigate = useNavigate();
  const { shortUrl } = useParams();

  const link = useLinks((store) => store.link);
  const countAccesses = useLinks((store) => store.countAccesses);
  const getLinkByShortUrl = useLinks((store) => store.getLinkByShortUrl);

  const fetchLinkByShortUrl = useCallback(async () => {
    try {
      if (shortUrl) {
        await getLinkByShortUrl(shortUrl);
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        navigate("/url/not-found");
      }
    }
  }, [getLinkByShortUrl, shortUrl, navigate]);

  const redirectToLink = useCallback(() => {
    window.location.href = link.url;
  }, [link.url]);

  useEffect(() => {
    fetchLinkByShortUrl();
  }, [fetchLinkByShortUrl]);

  useEffect(() => {
    if (link.url && link.id) {
      countAccesses(link.id);

      redirectToLink();
    }
  }, [link.url, link.id, navigate, countAccesses, redirectToLink]);

  return (
    <div className="flex items-center justify-center my-0 mx-auto h-dvh px-3">
      <main className="flex flex-col items-center justify-center gap-6 bg-white py-16 px-12 max-w-[580px] w-full rounded-lg">
        <img src={LogoIcon} alt="" className="h-12 w-12" />

        <h1 className="text-xl text-gray-600">Redirecionando...</h1>

        <div>
          <p className="text-md text-gray-500 text-center">
            O link será aberto automaticamente em alguns instantes.
          </p>
          <p className="text-md text-gray-500 text-center">
            Não foi redirecionado?{" "}
            <a
              className="text-blue-base underline cursor-pointer"
              onClick={redirectToLink}
            >
              Acesse aqui
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
