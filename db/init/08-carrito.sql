CREATE TABLE carritos (
    id_consumidor UUID PRIMARY KEY REFERENCES consumidores(id_consumidor) ON DELETE CASCADE ON UPDATE CASCADE,
    total DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP -- FIXIME: Aporta algo esta fecha? TODO: Habría que hacer un trigger para actualizarla.
);

CREATE TABLE carrito_productos (
    id_consumidor UUID NOT NULL REFERENCES carritos(id_consumidor) ON DELETE CASCADE,
    id_producto INTEGER NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- total DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0), TODO: descomentar y hacer trigger para llenarlo. cantidad * producto.precio
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

--TODO: Trigger cada vez que se agregan/modifican productos en el carrito se actualiza el total del carrito.