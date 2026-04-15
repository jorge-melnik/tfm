
CREATE EXTENSION IF NOT EXISTS postgis; -- para poder guardar un geometry POINT
CREATE EXTENSION IF NOT EXISTS pgcrypto;-- para generar los hash de tokens y contraseñas
CREATE EXTENSION IF NOT EXISTS citext;  -- para campos que deben ser no sensibles al "case"

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol') THEN
        CREATE TYPE ROL AS ENUM ('CONSUMIDOR', 'PRODUCTOR', 'ADMIN');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_server') THEN
        CREATE TYPE AUTH_SERVER AS ENUM ('GOOGLE', 'FACEBOOK', 'WHATSAPP');
    END IF;


    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_pedido') THEN
        CREATE TYPE ESTADO_PEDIDO AS ENUM ('PAGANDO', 'PAGADO', 'LISTO PARA ENTREGA','ENTREGADO','CANCELADO');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_pago') THEN
        CREATE TYPE ESTADO_PAGO AS ENUM ('PENDIENTE',  'APROBADO','RECHAZADO', 'CANCELADO');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_compra') THEN
        CREATE TYPE ESTADO_COMPRA AS ENUM ('PAGANDO',  'PAGADA');
    END IF;
END
$$;