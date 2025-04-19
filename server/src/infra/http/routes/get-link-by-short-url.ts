import { getLinkByShortUrl } from "@/app/functions/get-link-by-short-url";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const GetLinkByShortUrlRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/links/:shortUrl",
    {
      schema: {
        summary: "Get a link by short url",
        tags: ["links"],
        params: z.object({
          shortUrl: z.string().nonempty(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            url: z.string(),
            shortUrl: z.string(),
            createdAt: z.date(),
          }),
          404: z
            .object({
              error: z.object({
                code: z.number(),
                name: z.string(),
                message: z.string(),
              }),
            })
            .describe("Resource not found."),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params;

      const result = await getLinkByShortUrl({ shortUrl });

      if (isRight(result)) {
        const { createdAt, id, shortUrl, url } = unwrapEither(result);

        return reply.status(200).send({ createdAt, id, shortUrl, url });
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "ResourceNotFoundError":
          return reply.status(404).send({
            error: {
              code: 404,
              message: error.message,
              name: "ResourceNotFoundError",
            },
          });
      }
    }
  );
};
