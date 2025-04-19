import { z } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { isRight, unwrapEither } from "@/shared/either";
import { createLink } from "@/app/functions/create-link";

export const CreateLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/links",
    {
      schema: {
        summary: "Create a link",
        tags: ["links"],
        body: z.object({
          url: z.string().nonempty(),
          shortUrl: z.string().nonempty(),
        }),
        response: {
          201: z
            .object({
              id: z.string(),
              url: z.string(),
              clicks: z.number(),
              shortUrl: z.string(),
              createdAt: z.date(),
            })
            .describe("Link created."),
          400: z
            .object({
              error: z.object({
                code: z.number(),
                name: z.string(),
                message: z.string(),
              }),
            })
            .describe("Invalid short link format."),
          409: z
            .object({
              error: z.object({
                code: z.number(),
                name: z.string(),
                message: z.string(),
              }),
            })
            .describe("Short link already exists."),
        },
      },
    },
    async (request, reply) => {
      const { url, shortUrl } = request.body;

      const result = await createLink({
        url,
        shortUrl,
      });

      if (isRight(result)) {
        const response = unwrapEither(result);

        return reply.status(201).send({
          id: response.id,
          url: response.url,
          clicks: response.clicks,
          shortUrl: response.shortUrl,
          createdAt: response.createdAt,
        });
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "ShortLinkAlreadyExistsError":
          return reply.status(409).send({
            error: {
              code: 409,
              message: error.message,
              name: "ShortLinkAlreadyExistsError",
            },
          });
        case "InvalidShortLinkFormatError":
          return reply.status(400).send({
            error: {
              code: 400,
              message: error.message,
              name: "InvalidShortLinkFormatError",
            },
          });
      }
    }
  );
};
