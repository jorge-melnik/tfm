import { Rol } from '@schemas/auth.schema.ts';
import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    /**
     * Valida que la petición incluya un token JWT válido en el header `Authorization: Bearer <token>`.
     * Decodifica el payload y lo inyecta automáticamente en `request.user`.
     * @throws {DeAcaUnAuthenticated} Si no hay header, no empieza con 'Bearer ' o el token expiró/es inválido.
     */
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;

    /**
     * Hook de autorización estricta. Verifica que el usuario autenticado posea **TODOS** los roles indicados.
     * @param roles Un rol individual o un array con todos los roles requeridos.
     * @throws {DeAcaForbidden} Si al usuario le falta al menos uno de los roles especificados.
     */
    hasAllRoles: (roles: Rol[] | Rol) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;

    /**
     * Hook de autorización flexible. Verifica que el usuario autenticado posea **AL MENOS UNO** de los roles indicados.
     * @param roles Un rol individual o un array con los roles permitidos.
     * @throws {DeAcaForbidden} Si el usuario no tiene ninguno de los roles de la lista.
     */
    hasSomeRol: (roles: Rol[] | Rol) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;

    /**
     * Hook que asegura la consistencia de datos comparando que los campos especificados en la URL (`req.params`)
     * existan y tengan el mismo valor en el cuerpo (`req.body`).
     * @throws {DeAcaBadRequest} Si los valores no coinciden o faltan propiedades en el body.
     */
    matchParamsWithBody: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
