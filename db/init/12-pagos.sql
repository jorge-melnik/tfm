CREATE TABLE pagos (
    id_pago UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_compra INTEGER NOT NULL REFERENCES compras(id_compra) ON DELETE CASCADE,
    
    id_externo TEXT NOT NULL UNIQUE DEFAULT uuidv7(), -- esto es un id externo, el tipo podría cambiar según la plataforma o metodo de pago. por eso text.Si la plataforma no devuelve nada lo tendremos que inventar.
    metodo_pago TEXT,           
    estado_pago ESTADO_PAGO NOT NULL DEFAULT 'PENDIENTE',
    
    -- monto_pagado DECIMAL(12, 2) NOT NULL, será necesario? El usuario podría cambiar el importe y pagar menos?
    respuesta_raw JSONB NULL,   -- Vale la pena por "respaldo" ? 
    
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,   -- la llena un trigger
    
    CONSTRAINT pagos_id_compra_id_externo_uk UNIQUE NULLS NOT DISTINCT (id_compra, id_externo) -- FIXME: Para que no haya problemas con los nULL ? Solo un null a la vez. id_externo podría ser NOT NULL

);

-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha actualizacion -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_pagos_actualizar_fecha ON pagos;
CREATE TRIGGER tg_pagos_actualizar_fecha
BEFORE UPDATE ON pagos
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_actualizacion();

-------------------------------------------------
---- TRIGGERS para pagos
-------------------------------------------------
CREATE OR REPLACE FUNCTION fn_aprobar_pago_compra()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.estado_pago = 'APROBADO' AND (OLD.estado_pago IS DISTINCT FROM 'APROBADO')) THEN   
        UPDATE compras
        SET estado_compra = 'PAGADO'
        WHERE id_compra = NEW.id_compra AND estado_compra = 'PAGANDO';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_pago_aprobado ON pagos;
CREATE TRIGGER tg_pago_aprobado
AFTER UPDATE OF estado_pago ON pagos
FOR EACH ROW
EXECUTE FUNCTION fn_aprobar_pago_compra();
