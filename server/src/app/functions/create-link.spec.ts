import { fakerPT_BR as faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "@/infra/db";
import { createLink } from "./create-link";
import { schema } from "@/infra/db/schemas";
import { isLeft, isRight, unwrapEither } from "@/shared/either";
import { ShortLinkAlreadyExistsError } from "./errors/short-link-already-exists-error";

describe("Create link", () => {
  it("should be able to create a link", async () => {
    const url = faker.internet.url();
    const shortUrl = `localhost:3333/${randomUUID()}`;

    const sut = await createLink({
      url,
      shortUrl,
    });

    expect(isRight(sut)).toBe(true);

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortUrl, shortUrl));

    expect(result).toHaveLength(1);
  });

  it("should not be able to create an existing link", async () => {
    const url = faker.internet.url();
    const shortUrl = `localhost:3333/${randomUUID()}`;

    await createLink({
      url,
      shortUrl,
    });

    const sut = await createLink({
      url,
      shortUrl,
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ShortLinkAlreadyExistsError);
  });
});
