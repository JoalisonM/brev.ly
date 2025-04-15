import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
  hasZodFastifySchemaValidationErrors,
} from "fastify-type-provider-zod";

import { env } from "@/env";
import { GetLinksRoutes } from "./routes/get-links";
import { CreateLinkRoute } from "./routes/create-link";
import { DeleteLinkRoute } from "./routes/delete-link";
import { ExportLinksRoute } from "./routes/export-links";
import { GetLinkByShortUrlRoute } from "./routes/get-link-by-short-url";
import { IncreasingNumberOfAccessesRoute } from "./routes/increasing-number-of-link-accesses";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.validation,
    });
  }

  console.error(error);

  return reply.status(500).send({ message: "Internal Server Error." });
});

server.register(fastifyCors, { origin: "*" });

server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Link Server",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.register(GetLinksRoutes);
server.register(CreateLinkRoute);
server.register(DeleteLinkRoute);
server.register(ExportLinksRoute);
server.register(GetLinkByShortUrlRoute);
server.register(IncreasingNumberOfAccessesRoute);

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("🚀 HTTP server running!");
});
