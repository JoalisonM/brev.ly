import { z } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { unwrapEither } from "@/shared/either";
import { exportLinks } from "@/app/functions/export-links";

export const ExportLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/links/exports",
    {
      schema: {
        summary: "Export links",
        tags: ["links"],
        response: {
          200: z
            .object({ reportUrl: z.string() })
            .describe("Links exported successfully."),
        },
      },
    },
    async (_, reply) => {
      const result = await exportLinks();

      const { reportUrl } = unwrapEither(result);

      return reply.status(200).send({ reportUrl });
    }
  );
};
