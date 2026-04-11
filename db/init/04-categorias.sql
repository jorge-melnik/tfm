CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre CITEXT NOT NULL UNIQUE CHECK (
        char_length(nombre) >= 3 AND 
        char_length(nombre) <= 35
    ),
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS subcategorias (
    id_subcategoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria SMALLINT NOT NULL REFERENCES categorias(id_categoria) ON DELETE CASCADE ON UPDATE CASCADE,
    nombre CITEXT NOT NULL CHECK (
        char_length(nombre) >= 3 AND 
        char_length(nombre) <= 35
    ),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(id_categoria, nombre)
);

CREATE TABLE IF NOT EXISTS etiquetas (
    id_etiqueta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre CITEXT NOT NULL UNIQUE CHECK (
        char_length(nombre) >= 3 AND 
        char_length(nombre) <= 35
    )
);

CREATE TABLE IF NOT EXISTS subcategoria_etiquetas (
    id_subcategoria INTEGER REFERENCES subcategorias(id_subcategoria) ON DELETE CASCADE ON UPDATE CASCADE,
    id_etiqueta INTEGER REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id_subcategoria, id_etiqueta)
);
