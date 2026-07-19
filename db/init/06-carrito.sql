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
    PRIMARY KEY (id_consumidor, id_producto)
);
