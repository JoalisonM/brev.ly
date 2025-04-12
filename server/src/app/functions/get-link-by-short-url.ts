import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

const getLinkByShortUrlInput = z.object({
  shortUrl: z.string(),
});

type GetLinkByShortUrlInput = z.input<typeof getLinkByShortUrlInput>;

type GetLinkByShortUrlOutput = {
  id: string;
  url: string;
  shortUrl: string;
  createdAt: Date;
};

export async function getLinkByShortUrl({
  shortUrl,
}: GetLinkByShortUrlInput): Promise<
  Either<ResourceNotFoundError, GetLinkByShortUrlOutput>
> {
  const result = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  });

  if (!result) {
    return makeLeft(new ResourceNotFoundError());
  }

  return makeRight({
    id: result.id,
    url: result.url,
    shortUrl: result.shortUrl,
    createdAt: result.createdAt,
  });
}
