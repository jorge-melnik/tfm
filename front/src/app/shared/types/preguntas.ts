export type EstadoPregunta = 'PENDIENTE' | 'CONTESTADA';

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
  consumidor: string; // username
  estado_pregunta: EstadoPregunta;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion: string | null;
  respuestas: Respuesta[];
}
