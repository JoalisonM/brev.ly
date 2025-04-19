import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

const accessLinkInput = z.object({
  id: z.string(),
});

type AccessLinkInput = z.input<typeof accessLinkInput>;

type AccessLinkOutput = {
  id: string;
  url: string;
  clicks: number;
  shortUrl: string;
  createdAt: Date;
};

export async function increasingNumberOfLinkAccesses(
  input: AccessLinkInput
): Promise<Either<ResourceNotFoundError, AccessLinkOutput>> {
  const { id } = accessLinkInput.parse(input);

  const link = await db.query.links.findFirst({
    where: eq(schema.links.id, id),
  });

  if (!link) {
    return makeLeft(new ResourceNotFoundError());
  }

  const [{ url, shortUrl, clicks, createdAt }] = await db
    .update(schema.links)
    .set({ clicks: link.clicks + 1 })
    .where(eq(schema.links.id, id))
    .returning({
      url: schema.links.url,
      clicks: schema.links.clicks,
      shortUrl: schema.links.shortUrl,
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
