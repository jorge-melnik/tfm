import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyJWTOptions } from "@fastify/jwt";
import type { FastifyInstance } from "fastify";

/**
 * Este plugin permite firmar y verificar tokens JWT
 */
export default fp(async (fastify: FastifyInstance) => {
  const options: FastifyJWTOptions = {
    secret: process.env.JWT_SECRET || "super-secret-key-de-aca-2026",
    sign: {
      expiresIn: "1d", // El login dura una semana
    },
  };

  fastify.register(jwt, options);
});
