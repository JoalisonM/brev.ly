import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLinks } from "../store/links";
import { FormItem } from "./form-item";

const createLinkInput = z.object({
  url: z.string().nonempty("Informe uma url válida."),
  shortUrl: z
    .string()
    .nonempty("Informe uma url minúscula e sem espaço/caractere especial.")
    .startsWith("brev.ly/", { message: "A url deve iniciar com brev.ly/" })
    .regex(new RegExp(/^brev\.ly\/[a-z0-9]+(-[a-z0-9]+)*$/g), {
      message: "Informe uma url minúscula e sem espaço/caractere especial.",
    }),
});

type CreateLinkInput = z.infer<typeof createLinkInput>;

export function CreateLinkForm() {
  const addLink = useLinks((store) => store.addLink);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLinkInput),
  });

  async function onSubmit({ url, shortUrl }: CreateLinkInput) {
    addLink({
      url,
      shortUrl,
    });
  }

  return (
    <form
      className="flex flex-col gap-5 lg:gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-lg">Novo link</h1>

      <div className="flex flex-col gap-4">
        <FormItem label="LINK ORIGINAL" error={errors.url}>
          <Input
            id="original-link"
            type="text"
            placeholder="www.exemplo.com.br"
            className="group-data-[status=error]:border-danger group-data-[status=error]:focus:border-danger"
            {...register("url")}
          />
        </FormItem>

        <FormItem label="LINK ENCURTADO" error={errors.shortUrl}>
          <Input
            id="short-link"
            type="text"
            placeholder="brev.ly/"
            className="group-data-[status=error]:border-danger group-data-[status=error]:focus:border-danger"
            {...register("shortUrl")}
          />
        </FormItem>
      </div>

      <Button type="submit">Salvar link</Button>
    </form>
  );
}
