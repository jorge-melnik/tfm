import { Type, Static } from "@sinclair/typebox";

const RolLiteral = Type.Union([
  Type.Literal("PRODUCTOR"),
  Type.Literal("CONSUMIDOR"),
  Type.Literal("ADMIN"),
]);

export const LoginSchema = Type.Object({
  username: Type.String({}),
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

export const LoginEmailSchema = Type.Omit(LoginSchema, ["username"], {
  examples: [
    {
      email: "admin@deaca.com",
      password: "Contraseña",
    },
    {
      email: "productor@deaca.com",
      password: "Contraseña",
    },
    {
      email: "consumidor@deaca.com",
      password: "Contraseña",
    },
  ],
});
export const LoginUsernameSchema = Type.Omit(LoginSchema, ["email"], {
  examples: [
    {
      username: "admin",
      password: "Contraseña",
    },
    {
      username: "productor",
      password: "Contraseña",
    },
    {
      username: "consumidor",
      password: "Contraseña",
    },
  ],
});

export const AuthUserSchema = Type.Object({
  id_usuario: Type.Integer(),
  roles: Type.Array(RolLiteral, { minItems: 1 }),
});

export type LoginEmailType = Static<typeof LoginEmailSchema>;
export type LoginUsernameType = Static<typeof LoginUsernameSchema>;
export type AuthUser = Static<typeof AuthUserSchema>;
