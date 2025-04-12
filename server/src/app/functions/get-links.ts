import { z } from "zod";
import { asc, count, desc } from "drizzle-orm";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/shared/either";

const getLinksInput = z.object({
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
});

type GetLinksInput = z.input<typeof getLinksInput>;

type GetLinksOutput = {
  links: {
    id: string;
    url: string;
    shortUrl: string;
    createdAt: Date;
  }[];
  total: number;
};

export async function getLinks(
  input: GetLinksInput
): Promise<Either<never, GetLinksOutput>> {
  const { page, pageSize, sortBy, sortDirection } = getLinksInput.parse(input);

  const [links, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        url: schema.links.url,
        shortUrl: schema.links.shortUrl,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .orderBy((fields) => {
        if (sortBy && sortDirection === "asc") {
          return asc(fields[sortBy]);
        }

        if (sortBy && sortDirection === "desc") {
          return desc(fields[sortBy]);
        }

        return desc(fields.id);
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    db
      .select({
        total: count(schema.links.id),
      })
      .from(schema.links),
  ]);

  return makeRight({ links, total });
}
