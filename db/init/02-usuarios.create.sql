CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT uuidv7(),
    rol_actual ROL NOT NULL,                        -- Para guardar el último rol usado por el usuario
    roles ROL[] NOT NULL DEFAULT '{}',              -- Cuando se hace insert/update sobre productor/consumidor se agrega/quita el rol según el campo activo.
    activo BOOLEAN NOT NULL DEFAULT TRUE,           -- SOFT DELETE
    creado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado TIMESTAMP WITH TIME ZONE              -- Fecha de SOFT DELETE
);

-- Creamos una tabla aparte con los datos personales así sabemos que esto es lo que se debe borrar si el usuario se quiere dar de baja.
CREATE TABLE IF NOT EXISTS datos_personales (
    id_usuario UUID PRIMARY KEY REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE, -- Misma clave que usuarios
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    email CITEXT UNIQUE CHECK (
        char_length(email) <= 254 AND 
        email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
    ),
    username CITEXT UNIQUE CHECK (
        char_length(username) >= 5 AND 
        char_length(username) <= 30 AND
        username ~ '^[a-zA-Z0-9._]+$' 
    ),
    celular VARCHAR(20) UNIQUE CHECK (celular ~ '^\+[1-9]\d{6,14}$'),
    foto_url TEXT
    email_validado BOOLEAN NOT NULL DEFAULT false,
    celular_validado BOOLEAN NOT NULL DEFAULT false
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
    
    nombre CITEXT NOT NULL CHECK (
        char_length(nombre) >= 2 AND 
        char_length(nombre) <= 50 AND
    )
    direccion TEXT NOT NULL,    -- Calle, número, entre calles, lo que quieran
    comentarios TEXT,
    punto GEOMETRY(Point, 4326),
    
    creado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(nombre, id_usuario) -- Nombre no diferencia el case porque es tipo CITEXT
);

CREATE INDEX IF NOT EXISTS idx_ubicaciones_point ON ubicaciones USING GIST (point);
CREATE INDEX IF NOT EXISTS idx_usuarios_roles ON usuarios USING GIN (roles);