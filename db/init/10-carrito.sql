CREATE TABLE carritos (
    id_consumidor UUID PRIMARY KEY REFERENCES consumidores(id_consumidor) ON DELETE CASCADE ON UPDATE CASCADE,
    total DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP -- FIXIME: Aporta algo esta fecha? TODO: Habría que hacer un trigger para actualizarla.
);

CREATE TABLE carrito_productos (
    id_consumidor UUID NOT NULL REFERENCES carritos(id_consumidor) ON DELETE CASCADE ON UPDATE CASCADE,
    id_producto INTEGER NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE ON UPDATE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    PRIMARY KEY (id_consumidor, id_producto)
);


-------------------------------------------------------------------
----------- TRIGGER PARA ACTUALIZAR fecha actualizacion -----------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_carritos_actualizar_fecha ON carritos;
CREATE TRIGGER tg_carritos_actualizar_fecha
BEFORE UPDATE ON carritos
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_actualizacion();
-------------------------------------------------------------------
------- TRIGGERS PARA ACTUALIZAR carrito_productos.subtotal -------
-------------------------------------------------------------------
CREATE OR REPLACE FUNCTION tr_fn_carrito_productos_calcular_subtotal()
RETURNS TRIGGER AS $$
DECLARE
    v_precio DECIMAL(12, 2);
BEGIN
    SELECT precio INTO v_precio FROM productos WHERE id_producto = NEW.id_producto;

    IF v_precio IS NULL THEN RAISE EXCEPTION 'El producto con ID % no existe.', NEW.id_producto; END IF;
    
    NEW.subtotal := NEW.cantidad * v_precio;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_carrito_productos_calcular_subtotal ON carrito_productos;
CREATE TRIGGER tg_carrito_productos_calcular_subtotal
BEFORE INSERT OR UPDATE OF cantidad, id_producto ON carrito_productos
FOR EACH ROW
EXECUTE FUNCTION tr_fn_carrito_productos_calcular_subtotal();
---------------------- ahora si cambia el precio del producto ------------
CREATE OR REPLACE FUNCTION tr_fn_productos_actualizar_subtotales_carrito()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.precio IS DISTINCT FROM NEW.precio) THEN -- solo si el precio cambió.
        UPDATE carrito_productos
        SET subtotal = cantidad * NEW.precio
        WHERE id_producto = NEW.id_producto;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_productos_actualizar_subtotales_carrito ON productos;
CREATE TRIGGER tg_productos_actualizar_subtotales_carrito
AFTER UPDATE OF precio ON productos
FOR EACH ROW
EXECUTE FUNCTION tr_fn_productos_actualizar_subtotales_carrito();