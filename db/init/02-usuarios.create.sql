CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT uuidv7(),
    roles ROL[] NOT NULL DEFAULT '{}',              -- Cuando se hace insert/update sobre productor/consumidor se agrega/quita el rol según el campo activo.
    activo BOOLEAN NOT NULL DEFAULT TRUE,           -- SOFT DELETE
    creado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado TIMESTAMP WITH TIME ZONE              -- Fecha de SOFT DELETE
);

CREATE TABLE IF NOT EXISTS datos_personales (
    id_usuario UUID PRIMARY KEY REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE, -- Misma clave que usuarios
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    celular VARCHAR(20) UNIQUE,
    foto_url TEXT
);

CREATE TABLE IF NOT EXISTS productores (
    id_usuario UUID PRIMARY KEY REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE, -- Misma clave que usuarios
    presentación TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,            -- SOFT DELETE
    creado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado TIMESTAMP WITH TIME ZONE              -- Fecha de SOFT DELETE
);

CREATE TABLE IF NOT EXISTS consumidores (
    id_usuario UUID PRIMARY KEY REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE, -- Misma clave que usuarios
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado TIMESTAMP WITH TIME ZONE              -- Fecha de SOFT DELETE
);

CREATE TABLE IF NOT EXISTS ubicaciones (
    id_ubicacion UUID PRIMARY KEY DEFAULT uuidv7(),
    id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    id_localidad INTEGER NOT NULL REFERENCES localidades(id_localidad),
    
    nombre VARCHAR(50) NOT NULL,
    direccion VARCHAR(255) NOT NULL,    -- Calle, número, entre calles, lo que quieran
    point GEOMETRY(Point, 4326),
    
    creado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ubicaciones_point ON ubicaciones USING GIST (point);
CREATE INDEX IF NOT EXISTS idx_usuarios_roles ON usuarios USING GIN (roles);