import createError from '@fastify/error';

export const DeAcaUnAuthenticated = createError('DEACA_UNAUTHENTICATED', 'Credenciales inválidas. %s', 401);
export const DeAcaNotAuthorized = createError('DEACA_NOTAUTHORIZED', 'No autorizado. %s', 403);
export const DeAcaNotFound = createError('DEACA_NOTFOUND', 'Elemento no encontrado. %s', 404);
export const DeAcaInternal = createError('DEACA_INTERNAL', 'Error interno. %s', 500);
