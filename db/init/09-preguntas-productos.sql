CREATE TABLE preguntas (
    id_pregunta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto INTEGER NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
    id_consumidor UUID NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE CASCADE,
    contenido TEXT NOT NULL CHECK (char_length(trim(contenido)) >= 5 AND char_length(contenido) <= 500),
    estado_pregunta ESTADO_PREGUNTA NOT NULL DEFAULT 'PENDIENTE',
    activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  --//TODO: Trigger
    fecha_eliminacion TIMESTAMP WITH TIME ZONE                              --//TODO: Trigger. Ver cuando pasa a no activo.
);

CREATE TABLE respuestas (
    id_respuesta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pregunta INTEGER NOT NULL UNIQUE REFERENCES preguntas(id_pregunta) ON DELETE CASCADE, -- //FIXME: Por ahora la relación es uno a uno. Después no se.
    -- id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE, Por ahora solo contesta el propio productor del producto
    contenido TEXT NOT NULL CHECK (char_length(trim(contenido)) >= 1 AND char_length(contenido) <= 1000),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  --//TODO: Trigger
);

-------------------------------------------------------------------
----------- TRIGGERS PARA ACTUALIZAR fecha actualizacion ----------
-------------------------------------------------------------------
CREATE TRIGGER trg_actualizar_fecha_preguntas
BEFORE UPDATE ON preguntas
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_actualizacion();

CREATE TRIGGER trg_actualizar_fecha_respuestas
BEFORE UPDATE ON respuestas
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_actualizacion();

-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha eliminación   -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_pregunta_soft_delete ON productos;
CREATE TRIGGER trg_pregunta_soft_delete
BEFORE DELETE ON preguntas
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_eliminacion();

-------------------------------------------------------------------
------------- TRIGGER para cambiar el estado_pregunta  ------------
-------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_fn_cambiar_estado_pregunta_contestada()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE preguntas 
    SET estado_pregunta = 'CONTESTADA' 
    WHERE id_pregunta = NEW.id_pregunta 
      AND estado_pregunta = 'PENDIENTE';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_respuesta_pregunta
AFTER INSERT ON respuestas
FOR EACH ROW
EXECUTE FUNCTION trg_fn_cambiar_estado_pregunta_contestada();