import { LinkList } from "../components/link-list";
import { CreateLinkForm } from "../components/create-link-form";

export function Links() {
  return (
    <main className="flex flex-col items-center justify-center gap-3 max-w-[62.75rem] w-full px-3 lg:flex-row lg:items-start lg:justify-between">
      <section className="w-full bg-white p-6 rounded-lg lg:w-[23.75rem] lg:p-8">
        <CreateLinkForm />
      </section>

      <section className="w-full bg-white p-4 rounded-lg lg:w-[36.25rem] lg:p-8">
        <LinkList />
      </section>
    </main>
  );
}
