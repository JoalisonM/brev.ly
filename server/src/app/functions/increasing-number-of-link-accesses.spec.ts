import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import { makeLink } from "@/test/factories/make-link";
import { isLeft, isRight, unwrapEither } from "@/shared/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { increasingNumberOfLinkAccesses } from "./increasing-number-of-link-accesses";

describe("Count link accesses", () => {
  it("should be able to count link accesses", async () => {
    const namePattern = `${randomUUID()}first-test`;

    const link = await makeLink({
      shortUrl: `localhost:3333/${namePattern}-1`,
    });

    await increasingNumberOfLinkAccesses({ id: link.id });
    await increasingNumberOfLinkAccesses({ id: link.id });
    await increasingNumberOfLinkAccesses({ id: link.id });
    const sut = await increasingNumberOfLinkAccesses({ id: link.id });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({ clicks: link.clicks + 4 })
    );
  });

  it("should not be able to count accesses from links that do not exist.", async () => {
    const sut = await increasingNumberOfLinkAccesses({ id: randomUUID() });
    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFoundError);
  });
});
