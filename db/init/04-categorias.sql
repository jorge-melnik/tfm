CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre CITEXT NOT NULL UNIQUE CHECK (
        char_length(nombre) BETWEEN 3 AND 35
    ),
    slug_categoria CITEXT NOT NULL UNIQUE CHECK (
        char_length(slug_categoria) BETWEEN 3 AND 35
        AND slug_categoria ~ '^[a-zA-Z0-9-]+$' 
    ),-- TODO: TRIGGER para asegurarse que no se cambia el slug_categoria
    descripcion TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED
);

CREATE TABLE IF NOT EXISTS subcategorias (
    id_subcategoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria SMALLINT NOT NULL REFERENCES categorias(id_categoria) ON DELETE CASCADE ON UPDATE CASCADE,
    nombre CITEXT NOT NULL UNIQUE CHECK (
        char_length(nombre) BETWEEN 3 AND 35
    ),
    slug_subcategoria CITEXT NOT NULL UNIQUE CHECK (
        char_length(slug_subcategoria) BETWEEN 3 AND 35
        AND slug_subcategoria ~ '^[a-zA-Z0-9-]+$' 
    ),-- TODO: TRIGGER para asegurarse que no se cambia el slug_subcategoria
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED,
    UNIQUE(id_categoria, nombre),
    -- Esté índice lo hacemos para buscar tranquilamente por id_categoría e id_subcategoría, para no tener que chequear coincidencia en la ruta.
    INDEX subcategorias_id_categoria_IDX ON subcategorias (id_categoria, id_subcategoria) WHERE fecha_eliminacion IS NULL
);

CREATE TABLE IF NOT EXISTS etiquetas (
    id_etiqueta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre CITEXT NOT NULL UNIQUE CHECK (
        char_length(nombre) BETWEEN 3 AND 35
    ),
    slug_etiqueta CITEXT NOT NULL UNIQUE CHECK (
        char_length(slug_etiqueta) BETWEEN 3 AND 35
        AND slug_etiqueta ~ '^[a-zA-Z0-9-]+$' 
    )-- TODO: TRIGGER para asegurarse que no se cambia el slug_etiqueta
);

CREATE TABLE IF NOT EXISTS subcategoria_etiquetas (
    id_subcategoria INTEGER REFERENCES subcategorias(id_subcategoria) ON DELETE CASCADE ON UPDATE CASCADE,
    id_etiqueta INTEGER REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id_subcategoria, id_etiqueta)
);
