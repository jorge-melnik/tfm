CREATE TABLE pedidos (
    id_pedido INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_productor UUID NOT NULL REFERENCES productores(id_productor),
    id_compra INTEGER NOT NULL REFERENCES compras(id_compra) ON DELETE CASCADE,
    
    estado_pedido ESTADO_PEDIDO NOT NULL DEFAULT 'PAGANDO',    
    subtotal_pedido DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (subtotal_pedido >= 0),    -- TODO: Arranca a mano pero un trigger actualiza?

    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    fecha_listo_para_entrega TIMESTAMP WITH TIME ZONE, -- TODO: llenar estos dos ultimos con trigger
    fecha_entregado TIMESTAMP WITH TIME ZONE,
    
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
    CONSTRAINT pedido_productos_pedido_fk FOREIGN KEY (id_productor, id_pedido) REFERENCES pedidos(id_productor, id_pedido) ON DELETE CASCADE,
    CONSTRAINT pedio_productos_producto_fk FOREIGN KEY (id_productor, id_producto) REFERENCES productos(id_productor, id_producto) ON DELETE CASCADE
);

-- trigger pedidos si estado pedido es ENTREGADO fecha_entregado = CURRENT_TIMESTAMP
-- si estado es LISTO PARA ENTREGA fecha_listo_para_entrega = CURRENT_TIMESTAMP
-- idem fecha_actualizacion