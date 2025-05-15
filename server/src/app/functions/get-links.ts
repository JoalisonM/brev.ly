import { z } from "zod";
import { asc, count, desc, ilike } from "drizzle-orm";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/shared/either";

const getLinksInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
});

type GetLinksInput = z.input<typeof getLinksInput>;

type GetLinksOutput = {
  links: {
    id: string;
    url: string;
    shortUrl: string;
    createdAt: Date;
    clicks: number;
  }[];
  total: number;
};

export async function getLinks(
  input: GetLinksInput
): Promise<Either<never, GetLinksOutput>> {
  const { searchQuery, sortBy, sortDirection } = getLinksInput.parse(input);

  const [links, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        url: schema.links.url,
        shortUrl: schema.links.shortUrl,
        createdAt: schema.links.createdAt,
        clicks: schema.links.clicks,
      })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.shortUrl, `%${searchQuery}%`)
          : undefined
      )
      .orderBy((fields) => {
        if (sortBy && sortDirection === "asc") {
          return asc(fields[sortBy]);
        }

        if (sortBy && sortDirection === "desc") {
          return desc(fields[sortBy]);
        }

        return desc(fields.id);
      }),

    db
      .select({
        total: count(schema.links.id),
      })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.shortUrl, `%${searchQuery}%`)
          : undefined
      ),
    ,
  ]);

  return makeRight({ links, total });
}
