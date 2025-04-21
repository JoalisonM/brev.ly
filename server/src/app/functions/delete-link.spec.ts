import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import { deleteLink } from "./delete-link";
import { makeLink } from "@/test/factories/make-link";
import { isLeft, isRight, unwrapEither } from "@/shared/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

describe("Delete link", () => {
  it("should be able to delete a link", async () => {
    const namePattern = `${randomUUID()}first-test`;

    const link = await makeLink({
      shortUrl: `localhost:3333/${namePattern}-1`,
    });

    const sut = await deleteLink({ id: link.id });
    expect(isRight(sut)).toBe(true);
  });

  it("should not be able to delete a link that does not exist", async () => {
    const sut = await deleteLink({ id: randomUUID() });
    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFoundError);
  });
});
