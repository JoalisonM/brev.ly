import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { ShortLinkAlreadyExistsError } from "./errors/short-link-already-exists-error";
import { InvalidShortLinkFormatError } from "./errors/invalid-short-link-format-error";

const createLinkInput = z.object({
  url: z.string().url(),
  shortUrl: z.string().refine(
    (val) => {
      try {
        const path = new URL("http://" + val).pathname.slice(1);
        return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(path);
      } catch {
        return false;
      }
    },
    {
      message: "Informe uma url minúscula e sem espaço/caractere especial.",
    }
  ),
});

type CreateLinkInput = z.infer<typeof createLinkInput>;

type CreateLinkOutput = {
  id: string;
  url: string;
  clicks: number;
  shortUrl: string;
  createdAt: Date;
};

export async function createLink(
  input: CreateLinkInput
): Promise<
  Either<
    ShortLinkAlreadyExistsError | InvalidShortLinkFormatError,
    CreateLinkOutput
  >
> {
  const { url, shortUrl } = createLinkInput.parse(input);

  function isValidShortPath(shortUrl: string): boolean {
    const regex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

    try {
      const url = new URL(
        shortUrl.startsWith("http") ? shortUrl : "http://" + shortUrl
      );
      const path = url.pathname.slice(1);
      return regex.test(path);
    } catch {
      return false;
    }
  }

  const isValidShortLinkFormat = isValidShortPath(shortUrl);

  if (!isValidShortLinkFormat) {
    return makeLeft(new InvalidShortLinkFormatError());
  }

  const linkWithSameShortLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  });

  if (linkWithSameShortLink) {
    return makeLeft(new ShortLinkAlreadyExistsError());
  }

  const [{ id, createdAt, clicks }] = await db
    .insert(schema.links)
    .values({
      url,
      shortUrl,
    })
    .returning({
      id: schema.links.id,
      clicks: schema.links.clicks,
      createdAt: schema.links.createdAt,
    });

  return makeRight({
    id,
    url,
    clicks,
    shortUrl,
    createdAt,
  });
}
