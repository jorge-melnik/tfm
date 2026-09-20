import { BaseRepository } from './base.repository.js';
import { Mensaje } from '@schemas/compras.schema.js';

class MensajesRepositoryClass extends BaseRepository<Mensaje> {
  protected readonly tableName = 'mensajes';
  protected readonly idName = 'id_mensaje';
  protected readonly slugName?: keyof Mensaje = 'id_mensaje';

  //   export const Mensaje = Type.Object({
  //   id_mensaje: Type.Integer(),
  //   id_pedido: Pedido.properties.id_pedido,
  //   id_emisor: Consumidor.properties.id_consumidor,
  //   mensaje: Type.String(),
  //   fecha_creacion: Type.String({ format: 'date-time' }),

  //   emisor: Consumidor.properties.username,
  // });

  protected readonly baseQuery = `
    WITH MIS_MENSAJES AS (
      SELECT M.*
      , DPE.username as emisor
      FROM mensajes M
      LEFT JOIN datos_personales DPE ON DPE.id_usuario=M.id_emisor
      ORDER BY fecha_creacion ASC
    )
    SELECT * FROM MIS_MENSAJES MM
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const mensajesRepository = new MensajesRepositoryClass();
