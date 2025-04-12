import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeLeft, makeRight } from "@/shared/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

const deleteLinkInput = z.object({
  id: z.string(),
});

type DeleteLinkInput = z.input<typeof deleteLinkInput>;

type DeleteLinkOutput = {
  message: string;
};

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<ResourceNotFoundError, DeleteLinkOutput>> {
  const { id } = input;

  const linkExists = await db.query.links.findFirst({
    where: eq(schema.links.id, id),
  });

  if (!linkExists) {
    return makeLeft(new ResourceNotFoundError());
  }

  await db.delete(schema.links).where(eq(schema.links.id, id));

  return makeRight({
    message: "Link deleted successfully.",
  });
}
