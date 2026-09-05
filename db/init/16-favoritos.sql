CREATE TABLE IF NOT EXISTS favoritos (
    id_consumidor UUID NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE CASCADE ON UPDATE CASCADE,
    id_producto INTEGER NOT NULL  REFERENCES productos(id_producto) ON DELETE CASCADE ON UPDATE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_consumidor, id_producto)
);