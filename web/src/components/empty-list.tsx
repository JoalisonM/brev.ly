import { Link } from "@phosphor-icons/react";

export function EmptyList() {
  return (
    <div className="flex flex-col items-center justify-center h-[6.375rem] gap-y-3 lg:h-[7.375rem]">
      <Link className="w-8 h-8 text-gray-400" />
      <span className="text-xs text-gray-500">
        AINDA NÃO EXISTEM LINKS CADASTRADOS
      </span>
    </div>
  );
}
