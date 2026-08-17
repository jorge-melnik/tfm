CREATE TABLE compras (
    id_compra INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Cada comprador solo ve sus compras. Productor no ve las compras.
    id_consumidor UUID NOT NULL REFERENCES consumidores(id_consumidor),
    
    total DECIMAL(12, 2) NOT NULL CHECK (total >= 0) DEFAULT 0, -- hay un trigger en 11-pedidos.sql para actualizar total
    estado_compra ESTADO_COMPRA NOT NULL DEFAULT 'PAGANDO',
    
    direccion_envio TEXT NOT NULL,  -- Lo repetimos por si el usuario justo cambia/elimina la ubicación.
    contacto_receptor TEXT NOT NULL,-- 
    
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha actualizacion -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_compras_actualizar_fecha ON compras;
CREATE TRIGGER tg_compras_actualizar_fecha
BEFORE UPDATE ON compras
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_actualizacion();

-------------------------------------------------------------------
--------------------- TRIGGER PARA ACTUALIZAR PEDIDOS -------------
-------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_sincronizar_pedidos_con_compra()
RETURNS TRIGGER AS $$
BEGIN
    -- Cuando la compra pasa a 'PAGADO'
    IF (NEW.estado_compra = 'PAGADO' AND (OLD.estado_compra IS DISTINCT FROM 'PAGADO')) THEN
        UPDATE pedidos
        SET estado_pedido = 'PAGADO'
        WHERE id_compra = NEW.id_compra AND estado_pedido = 'PAGANDO';

    ELSIF (NEW.estado_compra = 'CANCELADO' AND (OLD.estado_compra IS DISTINCT FROM 'CANCELADO')) THEN        
        UPDATE pedidos
        SET estado_pedido = 'CANCELADO'
        WHERE id_compra = NEW.id_compra AND estado_pedido = 'PAGANDO';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_compra_actualizar_pedidos ON compras;

CREATE TRIGGER tg_compra_actualizar_pedidos
AFTER UPDATE OF estado_compra ON compras
FOR EACH ROW
EXECUTE FUNCTION fn_sincronizar_pedidos_con_compra();