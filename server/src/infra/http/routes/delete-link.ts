import { z } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { deleteLink } from "@/app/functions/delete-link";
import { isRight, unwrapEither } from "@/shared/either";

export const DeleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/links/:id",
    {
      schema: {
        summary: "Delete link",
        tags: ["links"],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z
            .object({ message: z.string() })
            .describe("Link deleted successfully."),
          404: z
            .object({ message: z.string() })
            .describe("Resource not found."),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const result = await deleteLink({ id });

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
