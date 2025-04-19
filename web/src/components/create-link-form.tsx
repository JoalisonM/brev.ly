import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormItem } from "./form-item";
import { useLinks } from "@/store/links";
import ShortLinkAlreadyExistsError from "@/errors/short-link-already-exists-error";

const createLinkInput = z.object({
  url: z
    .string()
    .url("Informe uma url válida.")
    .nonempty("Informe uma url válida."),
  shortUrl: z
    .string()
    .nonempty("Informe uma url minúscula e sem espaço/caractere especial.")
    .regex(new RegExp(/^[a-z0-9]+(-[a-z0-9]+)*$/g), {
      message: "Informe uma url minúscula e sem espaço/caractere especial.",
    }),
});

type CreateLinkInput = z.infer<typeof createLinkInput>;

export function CreateLinkForm() {
  const addLink = useLinks((store) => store.addLink);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(createLinkInput),
  });

  async function onSubmit({ url, shortUrl }: CreateLinkInput) {
    try {
      await addLink({
        url,
        shortUrl: `localhost:5173/${shortUrl}`,
      });

      reset();
    } catch (err) {
      if (err instanceof ShortLinkAlreadyExistsError) {
        toast.error("Erro no cadastro", {
          description: err.message,
        });
      }
    }
  }

  return (
    <form
      className="flex flex-col gap-5 lg:gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-lg">Novo link</h1>

      <div className="flex flex-col gap-4">
        <FormItem label="LINK ORIGINAL" error={errors.url}>
          <Input.Root className="group-data-[status=error]:border-danger group-data-[status=error]:focus-within:border-danger">
            <Input.Trigger
              id="original-link"
              type="text"
              placeholder="https://exemplo.com"
              {...register("url")}
            />
          </Input.Root>
        </FormItem>

        <FormItem label="LINK ENCURTADO" error={errors.shortUrl}>
          <Input.Root className="group-data-[status=error]:border-danger group-data-[status=error]:focus-within:border-danger">
            <Input.Prefix>brev.ly/</Input.Prefix>
            <Input.Trigger
              id="short-link"
              type="text"
              {...register("shortUrl")}
            />
          </Input.Root>
        </FormItem>
      </div>

      <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
        {!isSubmitting && "Salvar link"}
        {isSubmitting && "Salvando..."}
      </Button>
    </form>
  );
}
