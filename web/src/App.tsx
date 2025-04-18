import { Links } from "./pages/Links";
import { Header } from "./components/header";

export function App() {
  return (
    <div className="flex flex-col items-center justify-center my-0 mx-auto">
      <Header />

      <Links />
    </div>
  );
}
