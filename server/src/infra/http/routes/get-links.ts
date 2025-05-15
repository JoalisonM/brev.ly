import { z } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { getLinks } from "@/app/functions/get-links";
import { isRight, unwrapEither } from "@/shared/either";

export const GetLinksRoutes: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/links",
    {
      schema: {
        summary: "Get links",
        tags: ["links"],
        querystring: z.object({
          sortBy: z.enum(["createdAt"]).optional(),
          sortDirection: z.enum(["asc", "desc"]).optional(),
        }),
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                url: z.string(),
                shortUrl: z.string(),
                createdAt: z.date(),
                clicks: z.number(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sortBy, sortDirection } = request.query;

      const result = await getLinks({
        sortBy,
        sortDirection,
      });

      if (isRight(result)) {
        const { total, links } = unwrapEither(result);

        return reply.status(200).send({ total, links });
      }
    }
  );
};
