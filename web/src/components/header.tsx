import Logo from "@/assets/Logo.svg";

export function Header() {
  return (
    <header className="flex justify-center pt-8 pb-6 max-w-[62.75rem] w-full lg:pt-[5.5rem] lg:pb-8 lg:px-3 lg:justify-start">
      <span className="sr-only">Brev.ly logo</span>
      <img src={Logo} alt="" />
    </header>
  );
}
