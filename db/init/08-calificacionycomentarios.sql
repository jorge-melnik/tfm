CREATE TABLE producto_calificaciones (
    id_consumidor UUID NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE CASCADE,
    id_productor UUID NOT NULL,
    id_producto INTEGER NOT NULL,
    
    puntuacion SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_consumidor, id_productor, id_producto),
    CONSTRAINT producto_calificaciones_producto_fk FOREIGN KEY (id_productor, id_producto) REFERENCES productos(id_productor, id_producto) ON DELETE CASCADE
    -- TODO: Trigger para actualizar la calificación del producto en base al promedio de producto_calificaciones
);

CREATE TABLE producto_comentarios (
    id_consumidor UUID NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE CASCADE,
    id_productor UUID NOT NULL,
    id_producto INTEGER NOT NULL,
    id_pedido INTEGER NOT NULL,
    
    comentario TEXT NOT NULL CHECK (char_length(comentario) <= 500),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Esta primer FK es para asegurarse que el usuario calificó el producto, sino no podrá comentar.
    CONSTRAINT producto_comentarios_producto_calificacion_FK FOREIGN KEY (id_productor, id_producto,id_consumidor) REFERENCES producto_calificaciones(id_productor, id_producto,id_consumidor) ON DELETE CASCADE,
    CONSTRAINT producto_comentarios_pedido_producto_FK FOREIGN KEY (id_productor, id_pedido,id_producto) REFERENCES pedido_productos(id_productor, id_pedido,id_producto) ON DELETE CASCADE,
    CONSTRAINT producto_comentarios_pedido_producto_UK UNIQUE (id_productor, id_pedido,id_producto) ---- Esta UK es porque los comentarios se pueden dejar una vez por compra del producto.
);

CREATE TABLE pedido_calificaciones (
    id_productor UUID NOT NULL,
    id_pedido INTEGER NOT NULL,
    id_consumidor UUID NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE CASCADE,

    puntuacion SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT NOT NULL CHECK (char_length(comentario) <= 500),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_productor, id_pedido), --misma PK que pedido
    CONSTRAINT pedido_calificaciones_producto_fk FOREIGN KEY (id_productor, id_pedido) REFERENCES pedidos(id_productor, id_pedido) ON DELETE CASCADE
    -- TODO: Trigger para actualizar la calificación del productor en base al promedio de pedido_calificaciones
);