CREATE TABLE productos_carrito (
    id_consumidor UUID NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE CASCADE,
    id_productor UUID NOT NULL,
    id_producto INTEGER NOT NULL,
    
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_productor, id_producto, id_consumidor),
    FOREIGN KEY (id_productor, id_producto) REFERENCES productos(id_productor, id_producto) ON DELETE CASCADE
);