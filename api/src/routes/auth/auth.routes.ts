import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import authRepository from "@repositories/auth.repository.js";
import { LoginEmailSchema, LoginUsernameSchema } from "@schemas/auth.schema.js";

//Para manejar las mismas opciones en ambas rutas
const options = {
  expiresIn: "2h",
};

const root: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.post("/login/email", {
    schema: {
      tags: ["auth"],
      summary: "Email login",
      description: "Realizar login con email y contraseña.",
      body: LoginEmailSchema,
    },
    handler: async function (req, rep) {
      const payload = await authRepository.emailLogin(
        req.body.email,
        req.body.password,
      );
      const token = fastify.jwt.sign(payload, options);
      return { token };
    },
  });

  fastify.post("/login/username", {
    schema: {
      tags: ["auth"],
      summary: "Username login",
      description: "Realizar login con username y contraseña.",
      body: LoginUsernameSchema,
    },
    handler: async function (req, rep) {
      const payload = await authRepository.usernameLogin(
        req.body.username,
        req.body.password,
      );
      const token = fastify.jwt.sign(payload, options);
      return { token };
    },
  });
};

export default root;
