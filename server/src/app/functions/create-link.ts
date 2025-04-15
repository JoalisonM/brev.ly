import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { ShortLinkAlreadyExistsError } from "./errors/short-link-already-exists-error";
import { InvalidShortLinkFormatError } from "./errors/invalid-short-link-format-error";

const createLinkInput = z.object({
  url: z.string().url(),
  shortUrl: z.string().url(),
});

type CreateLinkInput = z.infer<typeof createLinkInput>;

type RightResponse = {
  id: string;
  url: string;
  shortUrl: string;
  createdAt: Date;
};

export async function createLink(
  input: CreateLinkInput
): Promise<
  Either<
    ShortLinkAlreadyExistsError | InvalidShortLinkFormatError,
    RightResponse
  >
> {
  const { url, shortUrl } = createLinkInput.parse(input);

  const isValidShortLinkFormat = shortUrl.startsWith("brev.ly/");

  if (!isValidShortLinkFormat) {
    return makeLeft(new InvalidShortLinkFormatError());
  }

  const linkWithSameShortLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  });

  if (linkWithSameShortLink) {
    return makeLeft(new ShortLinkAlreadyExistsError());
  }

  const [{ id, createdAt }] = await db
    .insert(schema.links)
    .values({
      url,
      shortUrl,
    })
    .returning({
      id: schema.links.id,
      createdAt: schema.links.createdAt,
    });

  return makeRight({
    id,
    url,
    shortUrl,
    createdAt,
  });
}
