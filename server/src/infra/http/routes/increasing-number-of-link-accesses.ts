import { increasingNumberOfLinkAccesses } from "@/app/functions/increasing-number-of-link-accesses";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const IncreasingNumberOfAccessesRoute: FastifyPluginAsyncZod = async (
  server
) => {
  server.patch(
    "/links/:id",
    {
      schema: {
        summary: "Update number of link accesses",
        tags: ["links"],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z
            .object({
              id: z.string(),
              url: z.string(),
              clicks: z.number(),
              shortUrl: z.string(),
              createdAt: z.date(),
            })
            .describe("Number of access increasing successfully."),
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
      const { id } = request.params;

      const result = await increasingNumberOfLinkAccesses({ id });

      if (isRight(result)) {
        const response = unwrapEither(result);

        return reply.status(200).send({
          id: response.id,
          url: response.url,
          clicks: response.clicks,
          shortUrl: response.shortUrl,
          createdAt: response.createdAt,
        });
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
