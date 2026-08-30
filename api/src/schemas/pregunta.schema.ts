import { Static, Type } from '@fastify/type-provider-typebox';
import { Consumidor } from './consumidores.schema.js';
import { Producto } from './producto.schema.js';
import { Productor } from './productores.schema.js';

export const EstadoPregunta = Type.Union([Type.Literal('PENDIENTE'), Type.Literal('CONTESTADA')], {
  description: 'Estado para las preguntas realizadas sobre un producto.',
});

export type EstadoPregunta = Static<typeof EstadoPregunta>;

export const Respuesta = Type.Object({
  id_respuesta: Type.Integer(),
  id_pregunta: Type.Integer(),
  contenido: Type.String(),
  fecha_creacion: Type.String({ format: 'date-time' }),
  fecha_actualizacion: Type.String({ format: 'date-time' }),
});

export type Respuesta = Static<typeof Respuesta>;

export const PreguntaPost = Type.Object({
  id_producto: Type.Integer(),
  id_consumidor: Consumidor.properties.id_consumidor,
  contenido: Type.String(),
});

export type PreguntaPost = Static<typeof PreguntaPost>;

export const Pregunta = Type.Object({
  id_pregunta: Type.Integer(),
  id_productor: Producto.properties.id_productor,
  ...PreguntaPost.properties,
  consumidor: Consumidor.properties.username,
  producto: Producto.properties.producto,
  estado_pregunta: EstadoPregunta,
  activo: Type.Boolean(),
  fecha_creacion: Type.String({ format: 'date-time' }),
  fecha_actualizacion: Type.String({ format: 'date-time' }),
  fecha_eliminacion: Type.String({ format: 'date-time' }),
  respuestas: Type.Array(Respuesta),
});

export type Pregunta = Static<typeof Pregunta>;
