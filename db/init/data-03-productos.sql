DO $$
DECLARE
    v_id_juan_huerta UUID;
    v_id_juan_ambos UUID;
BEGIN
    -- 1. Recuperamos los UUIDs dinámicos usando el username de los datos personales
    SELECT id_usuario INTO v_id_juan_huerta FROM datos_personales WHERE username = 'productor';
    SELECT id_usuario INTO v_id_juan_ambos FROM datos_personales WHERE username = 'ambos';

    -----------------------------------------------------------------------------------------
    -- PRODUCTOS DE JUAN HUERTA (id_productor: v_id_juan_huerta)
    -- Especializado en hortalizas orgánicas y miel.
    -----------------------------------------------------------------------------------------

    -- Producto 1: Miel Pura de Monte (Subcategoría 4: Miel)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 4, 'Miel Pura de Monte 1kg', 'miel-pura-monte-1kg', 'Miel cruda de abejas, cosechada de forma artesanal en montes nativos sin agroquímicos.', 450.00, 25);
    
    -- Imágenes asociadas (Posición 1 y 2)
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/miel_1.webp'),
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 2, 'productos/miel_2.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 8),   -- Cosecha silvestre
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 10);  -- Sin conservantes

    -- Producto 2: Tomate Perita Agroecológico (Subcategoría 1: Verduras)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 1, 'Tomate Perita Agroecológico kg', 'tomate-perita-agroecologico-kg', 'Tomates madurados en planta, cultivados con técnicas regenerativas cuidando el suelo.', 120.00, 50);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/tomates.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 3),   -- Sin agroquímicos
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 6),   -- Agroecológico
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 19);  -- De estación

    -- Producto 3: Huevos de Campo Pastoreo (Subcategoría 3: Huevos)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 3, 'Huevos de Campo x12', 'huevos-de-campo-x12', 'Huevos de gallinas libres, criadas a pastoreo e insumos naturales.', 180.00, 15);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/huevos.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 2),   -- Producción familiar
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 3);   -- Sin agroquímicos

    -- Producto 4: Compost Orgánico Maduro (Subcategoría 17: Compost)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 17, 'Compost Orgánico Maduro 5kg', 'compost-organico-maduro-5kg', 'Abono orgánico premium ideal para huertas y plantas, excelente retención de nutrientes.', 250.00, 30);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/compost.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 6),   -- Agroecológico
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 5: Plantín de Albahaca Criolla (Subcategoría 6: Plantines)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 6, 'Plantín de Albahaca Criolla', 'plantin-albahaca-criolla', 'Plantines listos para pasar a tierra o maceta, variedades adaptadas localmente.', 80.00, 40);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/albahaca.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 3),   -- Sin agroquímicos
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 6);   -- Agroecológico


    -----------------------------------------------------------------------------------------
    -- PRODUCTOS DE JUAN AMBOS (id_productor: v_id_juan_ambos)
    -- Productor artesanal de cosas variadas.
    -----------------------------------------------------------------------------------------

    -- Producto 6: Cuenco de Cerámica de Arcilla Local (Subcategoría 15: Cerámica)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 15, 'Cuenco de Cerámica Artesanal', 'cuenco-ceramica-artesanal', 'Modelado a mano con arcilla de cañada local, horneado a leña.', 550.00, 8);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/cuenco1.webp'),
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 2, 'productos/cuenco2.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 7: Jabón Ecológico de Caléndula (Subcategoría 11: Jabones naturales)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 11, 'Jabón de Caléndula y Oliva', 'jabon-calendula-oliva', 'Jabón corporal saponificado en frío, ideal para pieles sensibles y libre de químicos.', 190.00, 20);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/jabon.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 8: Canasta de Mimbre Mediana (Subcategoría 14: Mimbre)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 14, 'Canasta de Mimbre Tejida', 'canasta-mimbre-tejida', 'Canasta reforzada tejida a mano con mimbre natural del río.', 720.00, 5);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/canasta.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 9: Chutney de Manzana y Especias (Subcategoría 9: Conservas)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 9, 'Chutney de Manzana Agridulce', 'chutney-manzana-agridulce', 'Acompañamiento agridulce elaborado artesanalmente con frutas locales de estación.', 280.00, 12);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/chutney.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 10),  -- Sin conservantes
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 11),  -- Sin aditivos artificiales
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 14),  -- Sin gluten
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 17);  -- Vegano

    -- Producto 10: Tabla de Picar de Madera Recuperada (Subcategoría 16: Madera)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 16, 'Tabla para Picar de Olivo', 'tabla-picar-olivo', 'Tabla rústica confeccionada a mano a partir de maderas caídas y tratada con cera de abejas.', 890.00, 4);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/tabla.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    RAISE NOTICE '¡Productos e imágenes cargados con éxito para ambos productores!';
END $$;