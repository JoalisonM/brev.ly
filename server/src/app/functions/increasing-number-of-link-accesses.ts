import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/infra/db";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { schema } from "@/infra/db/schemas";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

const accessLinkInput = z.object({
  id: z.string(),
});

type AccessLinkInput = z.input<typeof accessLinkInput>;

type AccessLinkOutput = {
  message: string;
};

export async function increasingNumberOfLinkAccesses(
  input: AccessLinkInput
): Promise<Either<ResourceNotFoundError, AccessLinkOutput>> {
  const { id } = input;

  const link = await db.query.links.findFirst({
    where: eq(schema.links.id, id),
  });

  if (!link) {
    return makeLeft(new ResourceNotFoundError());
  }

  await db
    .update(schema.links)
    .set({ clicks: link.clicks + 1 })
    .where(eq(schema.links.id, id));

  return makeRight({
    message: "Number of access increasing successfully.",
  });
}
