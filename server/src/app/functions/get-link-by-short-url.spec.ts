import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import { makeLink } from "@/test/factories/make-link";
import { getLinkByShortUrl } from "./get-link-by-short-url";
import { isLeft, isRight, unwrapEither } from "@/shared/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

describe("Get link by short url", () => {
  it("should be able to get a link by a short url", async () => {
    const namePattern = `${randomUUID()}first-test`;

    const link = await makeLink({
      shortUrl: `localhost:3333/${namePattern}-1`,
    });

    const sut = await getLinkByShortUrl({ shortUrl: link.shortUrl });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(expect.objectContaining({ id: link.id }));
  });

  it("should not be able to get a link by a short url that does not exist", async () => {
    const sut = await getLinkByShortUrl({ shortUrl: "something" });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFoundError);
  });
});
