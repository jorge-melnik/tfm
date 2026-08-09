CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre CITEXT NOT NULL UNIQUE CHECK (
        char_length(nombre) BETWEEN 3 AND 35
    ),
    categoria CITEXT NOT NULL UNIQUE CHECK (
        char_length(categoria) BETWEEN 3 AND 35
        AND categoria ~ '^[a-zA-Z0-9-]+$' 
    ),
    descripcion TEXT,
    icono VARCHAR(24), --FIXME: Cambiar a NOT NULL
    color VARCHAR(7) NOT NULL DEFAULT '#6366F1', -- Color hexadecimal
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED
);

-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha actualizacion -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_categorias_actualizar_fecha ON categorias;
CREATE TRIGGER tg_categorias_actualizar_fecha
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_actualizacion();

-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha eliminación   -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_categorias_soft_delete ON categorias;
CREATE TRIGGER tg_categorias_soft_delete
BEFORE DELETE ON categorias
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_eliminacion();


-------------------------------------------------------------------
------- TRIGGER PARA inmutabilidad de categorias.categoria --------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_categorias_categoria_inmutable ON categorias;
CREATE TRIGGER tg_categorias_categoria_inmutable
BEFORE UPDATE OF categoria ON categorias
FOR EACH ROW
EXECUTE FUNCTION tr_fn_impedir_cambio_columna('categoria');