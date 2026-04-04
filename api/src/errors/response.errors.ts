import createError from "@fastify/error";

export const UnAuthenticated = createError(
  "DEACA_UNAUTHENTICATED",
  "Credenciales inválidas. %s",
  401,
);
