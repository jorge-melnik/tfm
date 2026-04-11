
CREATE EXTENSION IF NOT EXISTS postgis; -- para poder guardar un geometry POINT
CREATE EXTENSION IF NOT EXISTS pgcrypto;-- para generar los hash de tokens y contraseñas
CREATE EXTENSION IF NOT EXISTS citext;  -- para campos que deben ser no sensibles al "case"

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol') THEN
        CREATE TYPE ROL AS ENUM ('CONSUMIDOR', 'PRODUCTOR', 'ADMIN');
    END IF;

    -- Verificar y crear el tipo AUTH_SERVER
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_server') THEN
        CREATE TYPE AUTH_SERVER AS ENUM ('GOOGLE', 'FACEBOOK', 'WHATSAPP');
    END IF;
END
$$;