CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT uuidv7(),
    rol_actual ROL NOT NULL,                        -- Para guardar el último rol usado por el usuario
    roles ROL[] NOT NULL DEFAULT '{}',              -- Cuando se hace insert/update sobre productor/consumidor se agrega/quita el rol según el campo activo.
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED
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
        char_length(username) BETWEEN 5 AND 20
        AND username ~ '^[a-zA-Z0-9-]+$' 
    ),  --TODO trigger para asegurarse que no se modifica el username una vez creado
    -- aca username será el slug, por eso no hay campo aparte.
    celular VARCHAR(20) UNIQUE CHECK (celular ~ '^\+[1-9]\d{6,14}$'),
    foto_url TEXT,
    email_validado BOOLEAN NOT NULL DEFAULT false,
    celular_validado BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS productores (
    id_productor UUID PRIMARY KEY REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE, -- Misma clave que usuarios
    presentacion TEXT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED
);

CREATE TABLE IF NOT EXISTS consumidores (
    id_consumidor UUID PRIMARY KEY REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE, -- Misma clave que usuarios
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED
);

CREATE TABLE IF NOT EXISTS ubicaciones (
    id_ubicacion UUID PRIMARY KEY DEFAULT uuidv7(),
    id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    id_localidad INTEGER NOT NULL REFERENCES localidades(id_localidad),
    
    nombre CITEXT NOT NULL CHECK (
        char_length(nombre) BETWEEN 2 AND 32
    ),
    direccion TEXT NOT NULL,    -- Calle, número, entre calles, lo que quieran
    comentarios TEXT,
    punto GEOMETRY(Point, 4326),
    
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(nombre, id_usuario) -- Nombre no diferencia el case porque es tipo CITEXT
);

CREATE INDEX IF NOT EXISTS idx_ubicaciones_punto ON ubicaciones USING GIST (punto);
CREATE INDEX IF NOT EXISTS idx_usuarios_roles ON usuarios USING GIN (roles);