import createError from '@fastify/error';

export const BadRequestError = createError('BADREQUEST', 'Solicitud incorrecta. %s', 400);
export const UnAuthenticatedErrorError = createError('UnAuthenticatedError', 'Credenciales inválidas. %s', 401);
export const UnAuthorizedError = createError('UNAUTHORIZED', 'Credenciales inválidas. %s', 401);
export const NotAuthorizedError = createError('NOTAUTHORIZED', 'No autorizado. %s', 403);
export const ForbiddenError = createError('FORBIDDEN', 'Solicitud incorrecta. %s', 403);
export const NotFoundError = createError('NOTFOUND', 'Elemento no encontrado. %s', 404);
export const ConflictError = createError('CONFLICT', 'Existe un conflicto en los datos. %s', 409);

export const InternalError = createError('INTERNAL', 'Error interno. %s', 500);

export function transformarErrorPostgres(error: PostgresError) {
  const { table, constraint } = error;

  // "table": "pedido_productos",
  // "constraint": "pedio_productos_producto_fk",
  const elementoProblematico = constraint
    ?.substring(table?.length || 0)
    .toLowerCase()
    .replace('_fk', '')
    .replace('_key', '')
    .replace('_pk', '');
  console.log({ elementoProblematico });
  switch (error.code) {
    case '23000': //INTEGRITY CONSTRAINT VIOLATION
      return new ConflictError(`El ${elementoProblematico} no se puede borrar.`);
    case '23001': //RESTRICT VIOLATION
      return new ConflictError(`El ${elementoProblematico} no se puede borrar.`);
    case '23502': //NOT NULL VIOLATION
      return new BadRequestError(`El campo '${error.column || 'requerido'}' no puede estar vacío.`);
    case '23503': //FOREIGN KEY VIOLATION
      return new ConflictError(
        'No se puede completar la acción porque el registro está vinculado a otros datos.',
      );
    case '23505': //UNIQUE VIOLATION
      return new ConflictError(`Ya existe un ${elementoProblematico} en ${table} .`);
    case '23514': //CHECK VIOLATION
      return new BadRequestError('Los datos no cumplen con las reglas de validación del sistema.');
    default:
      return new InternalError('No se pudo completar la operación.');
  }
}

export interface PostgresError extends Error {
  code?: string;
  detail?: string;
  schema?: string;
  table?: string;
  column?: string;
  constraint?: string;
}

//  "length": 392,
//       "name": "error",
//       "severity": "ERROR",
//       "code": "23001",
//       "detail": "Key (id_productor, id_producto)=(01a097b6-8788-7042-8882-c79eb59c44c0, 42) is referenced from table \"pedido_productos\".",
//       "schema": "public",
//       "table": "pedido_productos",
//       "constraint": "pedio_productos_producto_fk",
//       "file": "ri_triggers.c",
//       "line": "2785",
//       "routine": "ri_ReportViolation"
