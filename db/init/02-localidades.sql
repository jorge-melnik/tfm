CREATE TABLE IF NOT EXISTS localidades (
    id_localidad INTEGER PRIMARY KEY, -- El id de ideuy
    id_departamento INTEGER NOT NULL REFERENCES departamentos(id_departamento) ON DELETE CASCADE ON UPDATE CASCADE,
    nombre CITEXT NOT NULL CHECK (
        char_length(nombre) BETWEEN 2 AND 32
    ),
    localidad CITEXT NOT NULL UNIQUE CHECK (
        char_length(localidad) BETWEEN 2 AND 32
        AND localidad ~ '^[a-zA-Z0-9-]+$' 
    ),
    UNIQUE(nombre, id_departamento)
);

DROP TRIGGER IF EXISTS tg_localidades_localidad_inmutable ON localidades;
CREATE TRIGGER tg_localidades_localidad_inmutable
BEFORE UPDATE OF localidad ON localidades
FOR EACH ROW
EXECUTE FUNCTION tr_fn_impedir_cambio_columna('localidad');