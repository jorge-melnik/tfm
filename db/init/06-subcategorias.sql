CREATE TABLE IF NOT EXISTS subcategorias (
    id_subcategoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria SMALLINT NOT NULL REFERENCES categorias(id_categoria) ON DELETE CASCADE ON UPDATE CASCADE,
    nombre CITEXT NOT NULL CHECK (  -- el nombre es único únicamente en la subcategoría.
        char_length(nombre) BETWEEN 3 AND 35
    ),
    subcategoria CITEXT NOT NULL UNIQUE CHECK (
        char_length(subcategoria) BETWEEN 3 AND 35
        AND subcategoria ~ '^[a-zA-Z0-9-]+$' 
    ),
    -- en api hereda color y/o ícono para que no quede tan cargado
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED,
    UNIQUE(id_categoria, nombre)
);
-- Esté índice lo hacemos para buscar tranquilamente por id_categoría e id_subcategoría, para no tener que chequear coincidencia en la ruta.
CREATE INDEX IF NOT EXISTS subcategorias_id_categoria_id_sub_idx 
ON subcategorias (id_categoria, id_subcategoria) 
WHERE fecha_eliminacion IS NULL;

-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha actualizacion -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_subcategorias_actualizar_fecha ON subcategorias;
CREATE TRIGGER tg_subcategorias_actualizar_fecha
BEFORE UPDATE ON subcategorias
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_actualizacion();

-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha eliminación   -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_subcategorias_soft_delete ON subcategorias;
CREATE TRIGGER tg_subcategorias_soft_delete
BEFORE DELETE ON subcategorias
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_eliminacion();


-------------------------------------------------------------------
---- TRIGGER PARA inmutabilidad de subcategorias.subcategoria -----
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_subcategorias_subcategoria_inmutable ON subcategorias;
CREATE TRIGGER tg_categorias_categoria_inmutable
BEFORE UPDATE OF subcategoria ON subcategorias
FOR EACH ROW
EXECUTE FUNCTION tr_fn_impedir_cambio_columna('subcategoria');