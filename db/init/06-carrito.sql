CREATE TABLE productos_carrito (
    id_usuario UUID NOT NULL REFERENCES consumidores(id_usuario) ON DELETE CASCADE,
    
    id_productor UUID NOT NULL,
    id_producto BIGINT NOT NULL,
    
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    agregado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_productor, id_producto),
    FOREIGN KEY (id_productor, id_producto) REFERENCES productos(id_productor, id_producto) ON DELETE CASCADE
);