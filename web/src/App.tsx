import { Copy, DownloadSimple, Link, Trash } from "@phosphor-icons/react";
import Logo from "./assets/Logo.svg";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export function App() {
  return (
    <div className="flex flex-col items-center justify-center my-0 mx-auto">
      <header className="flex justify-center pt-8 pb-6 max-w-[62.75rem] w-full lg:pt-[5.5rem] lg:pb-8 lg:px-3 lg:justify-start">
        <span className="sr-only">Brev.ly logo</span>
        <img src={Logo} alt="" />
      </header>

      <main className="flex flex-col items-center justify-center gap-3 max-w-[62.75rem] w-full px-3 lg:flex-row lg:items-start lg:justify-between">
        <section className="w-full bg-white p-6 rounded-lg lg:w-[23.75rem] lg:p-8">
          <form className="flex flex-col gap-5 lg:gap-6">
            <h1 className="text-lg">Novo link</h1>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="original-link"
                  className="text-gray-500 text-xs"
                >
                  LINK ORIGINAL
                </label>
                <Input
                  id="original-link"
                  type="text"
                  placeholder="www.exemplo.com.br"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="short-link" className="text-gray-500 text-xs">
                  LINK ENCURTADO
                </label>
                <Input id="short-link" type="text" placeholder="brev.ly/" />
              </div>
            </div>

            <Button type="button" disabled={true}>
              Salvar link
            </Button>
          </form>
        </section>

        <section className="flex flex-col w-full bg-white p-4 rounded-lg lg:w-[36.25rem] lg:p-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 lg:pb-5">
            <h1 className="text-lg">Meus links</h1>

            <Button variant="secondary" type="button" disabled={true}>
              <DownloadSimple className="h-4 w-4" />
              <span>Baixar CSV</span>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center h-[6.375rem] gap-y-3 lg:h-[7.375rem]">
            <Link className="w-8 h-8 text-gray-400" />
            <span className="text-xs text-gray-500">
              AINDA NÃO EXISTEM LINKS CADASTRADOS
            </span>
          </div>
          {/* <div className="grid grid-cols-1 divide-y divide-gray-200">
            <div className="grid grid-cols-[minmax(7rem,_22rem)_1fr_1fr] items-center gap-4 py-3">
              <div className="flex flex-col">
                <span className="text-md text-blue-base truncate">
                  brev.ly/Portifolio-Dev
                </span>
                <span className="text-sm tex-gray-500 truncate">
                  devsite.portfolio.com.br/devname-123456
                </span>
              </div>

              <span className="text-sm text-gray-500 text-nowrap">
                30 acessos
              </span>

              <div className="flex items-center justify-center gap-1">
                <Button variant="icon">
                  <Copy size={16} />
                </Button>
                <Button variant="icon">
                  <Trash size={16} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-[minmax(7rem,_22rem)_1fr_1fr] items-center gap-4 py-3">
              <div className="flex flex-col">
                <span className="text-md text-blue-base truncate">
                  brev.ly/Portifolio-Dev
                </span>
                <span className="text-sm tex-gray-500 truncate">
                  devsite.portfolio.com.br/devname-123456
                </span>
              </div>

              <span className="text-sm text-gray-500 text-nowrap">
                30 acessos
              </span>

              <div className="flex items-center justify-center gap-1">
                <Button variant="icon">
                  <Copy size={16} />
                </Button>
                <Button variant="icon">
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          </div> */}
        </section>
      </main>
    </div>
  );
}
