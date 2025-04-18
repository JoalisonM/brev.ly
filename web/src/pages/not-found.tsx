import { Link } from "react-router-dom";

import NotFoundImg from "../assets/404.svg";

export function NotFound() {
  return (
    <div className="flex items-center justify-center my-0 mx-auto h-dvh px-3">
      <main className="flex flex-col items-center justify-center gap-6 bg-white py-16 px-12 max-w-[580px] w-full rounded-lg">
        <img src={NotFoundImg} alt="" className="h-[85px]" />

        <h1 className="text-xl text-gray-600">Link não encontrado</h1>

        <p className="text-md text-gray-500 text-center">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{" "}
          <Link className="text-blue-base underline" to="/">
            brev.ly
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
