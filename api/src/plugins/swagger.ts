import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
  if (process.env.NODE_ENV !== "development") return; //docs de api solo development

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "De Acá - API Documentation",
        description:
          "Endpoints para productores y consumidores de productos orgánicos",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${process.env.FASTIFY_PORT || "3000"}`,
          description: "Fastify server",
        },
      ],
      tags: ["auth"],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "refreshToken",
          },
        },
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });
});
