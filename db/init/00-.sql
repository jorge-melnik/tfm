
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
        CREATE TYPE ESTADO_PAGO AS ENUM ('PENDIENTE', 'APROBADO','RECHAZADO', 'CANCELADO');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_compra') THEN
        CREATE TYPE ESTADO_COMPRA AS ENUM ('PAGANDO', 'PAGADO','CANCELADO');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_pregunta') THEN
        CREATE TYPE ESTADO_PREGUNTA AS ENUM ('PENDIENTE', 'CONTESTADA');
    END IF;
    
END
$$;

CREATE OR REPLACE FUNCTION fn_actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tr_fn_impedir_cambio_columna()
RETURNS TRIGGER AS $$
DECLARE
    v_columna TEXT := TG_ARGV[0];
BEGIN
    RAISE EXCEPTION 'No está permitido modificar el campo "%" de la tabla %.', 
        v_columna, TG_TABLE_NAME
        USING ERRCODE = 'check_violation';
END;
$$ LANGUAGE plpgsql;