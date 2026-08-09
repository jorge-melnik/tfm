CREATE TABLE pedidos (
    id_pedido INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_productor UUID NOT NULL REFERENCES productores(id_productor),
    id_compra INTEGER NOT NULL REFERENCES compras(id_compra) ON DELETE CASCADE,
    
    estado_pedido ESTADO_PEDIDO NOT NULL DEFAULT 'PAGANDO',    
    subtotal_pedido DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (subtotal_pedido >= 0),    -- Default 0 pero un trigger actualiza

    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,       -- la llena un trigger
    fecha_listo_para_entrega TIMESTAMP WITH TIME ZONE,  -- la llena un trigger
    fecha_entregado TIMESTAMP WITH TIME ZONE,           -- la llena un trigger
    
    UNIQUE (id_productor, id_pedido) -- para usar como FK en la entidad pedido_productos
);

-- Relacion 1 a N pero necesitamos guardar cantidad y precio al momento de la compra. Por eso esta tabla adicional.
CREATE TABLE pedido_productos (
    id_pedido INTEGER NOT NULL,
    id_productor UUID NOT NULL, -- ver las FK para entender porque está esto.
    id_producto INTEGER NOT NULL,
    
    cantidad INTEGER NOT NULL CHECK (cantidad > 0), 
    precio_unitario DECIMAL(12, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    
    PRIMARY KEY (id_productor, id_pedido, id_producto),

    -- para asegurarnos que el productor es el mismo en pedido y producto usamos FK compuestas.
    CONSTRAINT pedido_productos_pedido_fk FOREIGN KEY (id_productor, id_pedido) REFERENCES pedidos(id_productor, id_pedido) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT pedio_productos_producto_fk FOREIGN KEY (id_productor, id_producto) REFERENCES productos(id_productor, id_producto) ON DELETE CASCADE
);

-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha actualizacion -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_pedidos_actualizar_fecha ON pedidos;
CREATE TRIGGER tg_pedidos_actualizar_fecha
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_actualizacion();

-------------------------------------------------------------------
------------- TRIGGER PARA cambio de estado del pedido ------------
-------------------------------------------------------------------
CREATE OR REPLACE FUNCTION tr_fn_actualizar_hitos_pedido()
RETURNS TRIGGER AS $$
BEGIN
    -- Cuando el estado cambia a 'LISTO PARA ENTREGA' (o la constante exacta de tu ENUM)
    IF (NEW.estado_pedido = 'LISTO PARA ENTREGA' AND OLD.estado_pedido IS DISTINCT FROM 'LISTO PARA ENTREGA') THEN
        NEW.fecha_listo_para_entrega = CURRENT_TIMESTAMP;
    END IF;

    -- Cuando el estado cambia a 'ENTREGADO'
    IF (NEW.estado_pedido = 'ENTREGADO' AND OLD.estado_pedido IS DISTINCT FROM 'ENTREGADO') THEN
        NEW.fecha_entregado = CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_pedidos_hitos_estado ON pedidos;
CREATE TRIGGER tg_pedidos_hitos_estado
BEFORE UPDATE OF estado_pedido ON pedidos
FOR EACH ROW
EXECUTE FUNCTION tr_fn_actualizar_hitos_pedido();

-------------------------------------------------------------------
--------------- TRIGGERS PARA pedido.subtotal_pedido --------------
-------------------------------------------------------------------
CREATE OR REPLACE FUNCTION tr_fn_recalcular_subtotal_pedido()
RETURNS TRIGGER AS $$
BEGIN
    WITH pedidos_afectados AS (
        SELECT DISTINCT id_pedido FROM tabla_afectacion
    )
    UPDATE pedidos p
    SET subtotal_pedido = COALESCE((
        SELECT SUM(subtotal)
        FROM pedido_productos pp
        WHERE pp.id_pedido = p.id_pedido
    ), 0)
    FROM pedidos_afectados pa
    WHERE p.id_pedido = pa.id_pedido;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_pedido_productos_recalcular_subtotal_insert ON pedido_productos;
CREATE TRIGGER tg_pedido_productos_recalcular_subtotal_insert
AFTER INSERT ON pedido_productos
REFERENCING NEW TABLE AS tabla_afectacion
FOR EACH STATEMENT
EXECUTE FUNCTION tr_fn_recalcular_subtotal_pedido();

DROP TRIGGER IF EXISTS tg_pedido_productos_recalcular_subtotal_update ON pedido_productos;
CREATE TRIGGER tg_pedido_productos_recalcular_subtotal_update
AFTER UPDATE ON pedido_productos
REFERENCING NEW TABLE AS tabla_afectacion
FOR EACH STATEMENT
EXECUTE FUNCTION tr_fn_recalcular_subtotal_pedido();

DROP TRIGGER IF EXISTS tg_pedido_productos_recalcular_subtotal_delete ON pedido_productos;
CREATE TRIGGER tg_pedido_productos_recalcular_subtotal_delete
AFTER DELETE ON pedido_productos
REFERENCING OLD TABLE AS tabla_afectacion
FOR EACH STATEMENT
EXECUTE FUNCTION tr_fn_recalcular_subtotal_pedido();

-------------------------------------------------------------------
--------------------- TRIGGERS PARA compras.total -----------------
-------------------------------------------------------------------
CREATE OR REPLACE FUNCTION tr_fn_recalcular_total_compra()
RETURNS TRIGGER AS $$
BEGIN
    WITH compras_afectadas AS (
        SELECT DISTINCT id_compra FROM tabla_afectacion
    )
    UPDATE compras c
    SET total = COALESCE((
        SELECT SUM(subtotal_pedido)
        FROM pedidos p
        WHERE p.id_compra = c.id_compra
    ), 0)
    FROM compras_afectadas ca
    WHERE c.id_compra = ca.id_compra;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- En el INSERT de pedidos no es necesario actualizar compra.importe, porque el importe del pedido iniciará en cero.
DROP TRIGGER IF EXISTS tg_pedidos_recalcular_total_compra_update ON pedidos;
CREATE TRIGGER tg_pedidos_recalcular_total_compra_update
AFTER UPDATE ON pedidos
REFERENCING NEW TABLE AS tabla_afectacion
FOR EACH STATEMENT
EXECUTE FUNCTION tr_fn_recalcular_total_compra();

DROP TRIGGER IF EXISTS tg_pedidos_recalcular_total_compra_delete ON pedidos;
CREATE TRIGGER tg_pedidos_recalcular_total_compra_delete
AFTER DELETE ON pedidos
REFERENCING OLD TABLE AS tabla_afectacion
FOR EACH STATEMENT
EXECUTE FUNCTION tr_fn_recalcular_total_compra();