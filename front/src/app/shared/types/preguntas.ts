export type EstadoPregunta = 'PENDIENTE' | 'CONTESTADA';

export interface RespuestaPost {
  id_producto: number;
  producto: string;
  id_pregunta: number;
  contenido: string;
}

export interface Respuesta {
  id_respuesta: number;
  id_pregunta: number;
  usuario: string;
  contenido: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface PreguntaPost {
  id_producto: number;
  id_consumidor: string;
  contenido: string;
}

export interface Pregunta extends PreguntaPost {
  id_pregunta: number;
  id_productor: string;
  id_producto: number;
  consumidor: string; // username
  producto: string;
  estado_pregunta: EstadoPregunta;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion: string | null;
  respuestas: Respuesta[];
}
