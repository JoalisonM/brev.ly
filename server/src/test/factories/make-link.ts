import { fakerPT_BR as faker } from "@faker-js/faker";
import { InferInsertModel } from "drizzle-orm";

import { schema } from "@/infra/db/schemas";
import { db } from "@/infra/db";

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const url = faker.internet.url();
  const shortUrl = faker.internet.url();

  const result = await db
    .insert(schema.links)
    .values({
      url: url,
      shortUrl: shortUrl,
      ...overrides,
    })
    .returning();

  return result[0];
}
