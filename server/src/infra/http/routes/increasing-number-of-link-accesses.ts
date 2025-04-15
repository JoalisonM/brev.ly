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
            .object({ message: z.string() })
            .describe("Number of access increasing successfully."),
          404: z
            .object({ message: z.string() })
            .describe("Resource not found."),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const result = await increasingNumberOfLinkAccesses({ id });

      if (isRight(result)) {
        const { message } = unwrapEither(result);

        return reply.status(200).send({ message });
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "ResourceNotFoundError":
          return reply.status(404).send({ message: error.message });
      }
    }
  );
};
