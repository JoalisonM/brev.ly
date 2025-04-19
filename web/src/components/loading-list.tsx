import { Spinner } from "@phosphor-icons/react";

export function LoadingList() {
  return (
    <div className="flex flex-col items-center justify-center h-[6.375rem] gap-y-3 lg:h-[7.375rem]">
      <Spinner className="w-8 h-8 text-gray-400 animate-spin" />
      <span className="text-xs text-gray-500">CARREGANDO LINKS...</span>
    </div>
  );
}
