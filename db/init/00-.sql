CREATE EXTENSION IF NOT EXISTS postgis;

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