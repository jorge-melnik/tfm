CREATE TABLE compras (
    id_compra BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Cada comprador solo ve sus compras. Productor no ve las compras.
    id_usuario UUID NOT NULL REFERENCES consumidores(id_usuario),
    
    total DECIMAL(12, 2) NOT NULL CHECK (total >= 0) DEFAULT 0,     -- TODO: Arranca a mano pero un trigger actualiza?
    estado_compra ESTADO_COMPRA NOT NULL DEFAULT 'PAGANDO',
    
    direccion_envio TEXT NOT NULL,  -- Lo repetimos por si el usuario justo cambia/elimina la ubicación.
    contacto_receptor TEXT NOT NULL,-- 
    
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pagos (
    id_pago UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_compra BIGINT NOT NULL REFERENCES compras(id_compra) ON DELETE CASCADE,
    
    id_externo TEXT, -- esto es un id externo, el tipo podría cambiar según la plataforma o metodo de pago. por eso text. UNIQUE? TODO
    metodo_pago TEXT,           
    estado_pago ESTADO_PAGO NOT NULL DEFAULT 'PENDIENTE',
    
    -- monto_pagado DECIMAL(12, 2) NOT NULL, será necesario? El usuario podría cambiar el importe y pagar menos?
    respuesta_raw JSONB NULL,   -- Vale la pena por "respaldo" ? 
    
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE,   -- TODO: Cargada con trigger.
    
    
    CONSTRAINT pagos_id_compra_id_externo_uk UNIQUE (id_compra, id_externo)
);

-- Afuera porque tenemos una dependencia circular en compras y pagos.
ALTER TABLE compras     -- TODO hacer trigger para chequear que el estado del pago exitoso sea CONFIRMADO
ADD COLUMN id_pago_exitoso UUID NULL REFERENCES pagos(id_pago);

CREATE TABLE pedidos (
    id_productor UUID NOT NULL REFERENCES productores(id_usuario),
    id_pedido BIGINT GENERATED ALWAYS AS IDENTITY,
    id_compra BIGINT NOT NULL REFERENCES compras(id_compra) ON DELETE CASCADE,
    
    estado_pedido ESTADO_PEDIDO NOT NULL DEFAULT 'PAGANDO',    
    subtotal_pedido DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (subtotal_pedido >= 0),    -- TODO: Arranca a mano pero un trigger actualiza?

    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP WITH TIME ZONE, -- TODO: llenar estos dos ultimos con trigger
    fecha_entrega TIMESTAMP WITH TIME ZONE,
    
    PRIMARY KEY (id_productor, id_pedido) -- entidad debil
);

-- Relacion 1 a N pero necesitamos guardar cantidad y precio al momento de la compra. Por eso esta tabla adicional.
CREATE TABLE pedido_productos (
    id_productor UUID NOT NULL,
    id_pedido BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    
    cantidad INTEGER NOT NULL CHECK (cantidad > 0), 
    precio_unitario DECIMAL(12, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    
    PRIMARY KEY (id_productor, id_pedido, id_producto),
    CONSTRAINT pedido_productos_pedido_fk FOREIGN KEY (id_productor, id_pedido) REFERENCES pedidos(id_productor, id_pedido) ON DELETE CASCADE,
    CONSTRAINT pedio_productos_producto_fk FOREIGN KEY (id_productor, id_producto) REFERENCES productos(id_productor, id_producto) ON DELETE CASCADE
);