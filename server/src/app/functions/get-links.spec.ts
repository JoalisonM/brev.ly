import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { getLinks } from "./get-links";
import { makeLink } from "@/test/factories/make-link";
import { isRight, unwrapEither } from "@/shared/either";

describe("Get links", () => {
  it("should be able to get links", async () => {
    const namePattern = `${randomUUID()}first-test`;

    const link1 = await makeLink({
      shortUrl: `localhost:3333/${namePattern}-1`,
    });
    const link2 = await makeLink({
      shortUrl: `localhost:3333/${namePattern}-2`,
    });
    const link3 = await makeLink({
      shortUrl: `localhost:3333/${namePattern}-3`,
    });
    const link4 = await makeLink({
      shortUrl: `localhost:3333/${namePattern}-4`,
    });

    const sut = await getLinks({
      searchQuery: namePattern,
    });
    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(4);
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ]);
  });

  it("should be able to get sorted links", async () => {
    const namePattern = `${randomUUID()}third-test`;

    const link1 = await makeLink({
      shortUrl: `${namePattern}-1`,
      createdAt: new Date(),
    });

    const link2 = await makeLink({
      shortUrl: `${namePattern}-2`,
      createdAt: dayjs().subtract(1, "days").toDate(),
    });

    const link3 = await makeLink({
      shortUrl: `${namePattern}-3`,
      createdAt: dayjs().subtract(2, "days").toDate(),
    });

    const link4 = await makeLink({
      shortUrl: `${namePattern}-4`,
      createdAt: dayjs().subtract(3, "days").toDate(),
    });

    let sut = await getLinks({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "desc",
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(4);
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link1.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link4.id }),
    ]);

    sut = await getLinks({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "asc",
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(4);
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ]);
  });
});
