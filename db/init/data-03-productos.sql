DO $$
DECLARE
    v_id_productor UUID;
    v_id_ambos UUID;
    v_id_consumidor UUID;
BEGIN
    -- 1. Recuperamos los UUIDs dinámicos usando el username de los datos personales
    SELECT id_usuario INTO v_id_productor FROM datos_personales WHERE username = 'productor';
    SELECT id_usuario INTO v_id_ambos FROM datos_personales WHERE username = 'ambos';
    SELECT id_usuario INTO v_id_consumidor FROM datos_personales WHERE username = 'consumidor';

    -----------------------------------------------------------------------------------------
    -- PRODUCTOS DE JUAN HUERTA (id_productor: v_id_productor)
    -- Especializado en hortalizas orgánicas, plantines, miel, huevos y tierra.
    -----------------------------------------------------------------------------------------

    -- Producto 1: Miel Pura de Monte (Subcategoría 4: Miel)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 4, 'Miel Pura de Monte 1kg', 'miel-pura-monte-1kg', 'Miel cruda de abejas, cosechada de forma artesanal en montes nativos sin agroquímicos.', 450.00, 25);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/miel_1.webp'),
    ( currval('productos_id_producto_seq'), 2, '/productos/miel_2.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 8),   -- Cosecha silvestre
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 10);  -- Sin conservantes

    -- Preguntas para el producto anterior
    INSERT INTO preguntas (id_producto, id_consumidor, contenido, estado_pregunta, fecha_creacion)
    VALUES (
        currval('productos_id_producto_seq'), 
        v_id_consumidor, 
        '¡Hola! ¿Realizan envíos a domicilio o solo se retira por el local?', 
        'CONTESTADA',
        CURRENT_TIMESTAMP - INTERVAL '5 days'
    );

    INSERT INTO respuestas (id_pregunta, contenido, fecha_creacion)
    VALUES (
        currval('preguntas_id_pregunta_seq'), 
        '¡Hola! Hacemos envíos sin cargo dentro de la zona los días martes y viernes.',
        CURRENT_TIMESTAMP - INTERVAL '5 day'
    );

    INSERT INTO preguntas (id_producto, id_consumidor, contenido, estado_pregunta, fecha_creacion)
    VALUES (
        currval('productos_id_producto_seq'), 
        v_id_ambos, 
        '¿Cuál es la fecha de vencimiento o elaboración del lote actual?', 
        'CONTESTADA',
        CURRENT_TIMESTAMP - INTERVAL '3 days'
    );

    INSERT INTO respuestas (id_pregunta, contenido, fecha_creacion)
    VALUES (
        currval('preguntas_id_pregunta_seq'),
        'Hola, el lote actual fue envasado esta misma semana y tiene un vencimiento sugerido de 12 meses.',
        CURRENT_TIMESTAMP - INTERVAL '2 days'
    );

    INSERT INTO preguntas (id_producto, id_consumidor, contenido, estado_pregunta, fecha_creacion)
    VALUES (
        currval('productos_id_producto_seq'), 
        v_id_consumidor, 
        '¿Tienen descuento si compro más de 10 unidades?', 
        'PENDIENTE',
        CURRENT_TIMESTAMP - INTERVAL '3 hours'
    );

    -- Producto 2: Tomate Perita Agroecológico (Subcategoría 1: Verduras)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 1, 'Tomate Perita Agroecológico kg', 'tomate-perita-agroecologico-kg', 'Tomates madurados en planta, cultivados con técnicas regenerativas cuidando el suelo.', 120.00, 50);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/tomates.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 3),   -- Sin agroquímicos
    ( currval('productos_id_producto_seq'), 6),   -- Agroecológico
    ( currval('productos_id_producto_seq'), 19);  -- De estación

    -- Producto 3: Huevos de Campo Pastoreo (Subcategoría 3: Huevos)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 3, 'Huevos de Campo x12', 'huevos-de-campo-x12', 'Huevos de gallinas libres, criadas a pastoreo e insumos naturales.', 180.00, 15);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/huevos.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 2),   -- Producción familiar
    ( currval('productos_id_producto_seq'), 3);   -- Sin agroquímicos

    -- Producto 4: Compost Orgánico Maduro (Subcategoría 17: Compost)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 17, 'Compost Orgánico Maduro 5kg', 'compost-organico-maduro-5kg', 'Abono orgánico premium ideal para huertas y plantas, excelente retención de nutrientes.', 250.00, 30);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/compost.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 6),   -- Agroecológico
    ( currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 5: Plantín de Albahaca Criolla (Subcategoría 6: Plantines)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 6, 'Plantín de Albahaca Criolla', 'plantin-albahaca-criolla', 'Plantines listos para pasar a tierra o maceta, variedades adaptadas localmente.', 80.00, 40);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/albahaca.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 3),   -- Sin agroquímicos
    ( currval('productos_id_producto_seq'), 6);   -- Agroecológico

    -- Producto 6: Atado de Acelga Ancha (Subcategoría 1: Verduras)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 1, 'Atado de Acelga Orgánica', 'atado-acelga-organica', 'Hojas verdes, carnosas y frescas recién cosechadas por la mañana.', 95.00, 20);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/acelga.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 6),   -- Agroecológico
    ( currval('productos_id_producto_seq'), 19);  -- De estación

    -- Producto 7: Zapallo Anco por kg (Subcategoría 1: Verduras)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 1, 'Zapallo Anco Agroecológico kg', 'zapallo-anco-agroecologico-kg', 'Zapallos dulces de pulpa firme, ideales para puré o al horno.', 110.00, 60);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/zapallo.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 3);   -- Sin agroquímicos

    -- Producto 8: Miel con Panal de Abeja (Subcategoría 4: Miel)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 4, 'Miel con Panal Artesanal 500g', 'miel-panal-artesanal-500g', 'Frasco premium que incluye un trozo de panal 100% comestible y natural.', 380.00, 10);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/miel_panal.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 10);  -- Sin conservantes

    -- Producto 9: Plantín de Morrón Rojo (Subcategoría 6: Plantines)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 6, 'Plantín de Morrón Rojo', 'plantin-morron-rojo', 'Plantines vigorosos con excelente sistema radicular, listos para tu huerta.', 85.00, 25);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/plantin_morron.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 6);   -- Agroecológico

    -- Producto 10: Humus de Lombriz Líquido (Subcategoría 17: Compost)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 17, 'Humus Líquido Lixiviado 1L', 'humus-liquido-lixiviado-1l', 'Fertilizante foliar y radicular orgánico de rápida absorción para potenciar tus plantas.', 190.00, 18);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/humus_liquido.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 6),   -- Agroecológico
    ( currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 11: Atado de Flores Benéficas (Subcategoría 6: Plantines)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 6, 'Mix Flores para Huerta (Copetes)', 'mix-flores-huerta-copetes', 'Plantines de copetes y caléndulas, ideales para control biológico de plagas.', 140.00, 15);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/copetes.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 3);   -- Sin agroquímicos

    -- Producto 12: Frasco de Polen Seco (Subcategoría 4: Miel)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 4, 'Polen de Abeja Granulado 150g', 'polen-abeja-granulado-150g', 'Superalimento natural energizante, recolectado en zonas libres de contaminación.', 290.00, 12);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/polen.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 8),   -- Cosecha silvestre
    ( currval('productos_id_producto_seq'), 10);  -- Sin conservantes

    -- Producto 13: Bolsa de Tierra Preparada (Subcategoría 17: Compost)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 17, 'Substrato Huerta Orgánica 10dm3', 'substrato-huerta-organica-10dm3', 'Mezcla óptima de tierra negra, compost maduro, perlita y turba local.', 220.00, 25);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/tierra_preparada.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 13), -- Biodegradable
    ( currval('productos_id_producto_seq'), 6);  -- Agroecologico

    -- Producto 14: Cabezas de Ajo Morado (Subcategoría 1: Verduras)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 1, 'Riestra de Ajo Morado x3', 'riestra-ajo-morado-x3', 'Ajos de aroma intenso, curados al sol, ideales para conservación prolongada.', 130.00, 35);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/ajos.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 19);  -- De estación

    -- Producto 15: Plantín de Menta Peperina (Subcategoría 6: Plantines)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 6, 'Plantín de Menta Peperina', 'plantin-menta-peperina', 'Planta aromática medicinal ideal para el mate o infusiones frescas.', 75.00, 30);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/peperina.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 3);   -- Sin agroquímicos


    -----------------------------------------------------------------------------------------
    -- PRODUCTOS DE JUAN AMBOS (id_productor: v_id_ambos)
    -- Productor artesanal: Cerámica, Mimbre, Madera, Conservas, Cosmética y Panificados.
    -----------------------------------------------------------------------------------------

    -- Producto 16: Cuenco de Cerámica de Arcilla Local (Subcategoría 15: Cerámica)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 15, 'Cuenco de Cerámica Artesanal', 'cuenco-ceramica-artesanal', 'Modelado a mano con arcilla de cañada local, horneado a leña.', 550.00, 8);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/cuenco1.webp'),
    ( currval('productos_id_producto_seq'), 2, '/productos/cuenco2.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1),   -- Local
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Preguntas para el producto anterior
    INSERT INTO preguntas (id_producto, id_consumidor, contenido, estado_pregunta, fecha_creacion)
    VALUES (
        currval('productos_id_producto_seq'), 
        v_id_consumidor, 
        '¡Hola! ¿Realizan envíos a domicilio o solo se retira por el local?', 
        'CONTESTADA',
        CURRENT_TIMESTAMP - INTERVAL '5 days'
    );

    INSERT INTO respuestas (id_pregunta, contenido, fecha_creacion)
    VALUES (
        currval('preguntas_id_pregunta_seq'), 
        '¡Hola! Hacemos envíos sin cargo dentro de la zona los días martes y viernes.',
        CURRENT_TIMESTAMP - INTERVAL '5 day'
    );

    INSERT INTO preguntas (id_producto, id_consumidor, contenido, estado_pregunta, fecha_creacion)
    VALUES (
        currval('productos_id_producto_seq'), 
        v_id_consumidor, 
        '¿Cuál es la fecha de vencimiento o elaboración del lote actual?', 
        'CONTESTADA',
        CURRENT_TIMESTAMP - INTERVAL '3 days'
    );

    INSERT INTO respuestas (id_pregunta, contenido, fecha_creacion)
    VALUES (
        currval('preguntas_id_pregunta_seq'),
        'Hola, el lote actual fue envasado esta misma semana y tiene un vencimiento sugerido de 12 meses.',
        CURRENT_TIMESTAMP - INTERVAL '2 days'
    );

    INSERT INTO preguntas (id_producto, id_consumidor, contenido, estado_pregunta, fecha_creacion)
    VALUES (
        currval('productos_id_producto_seq'), 
        v_id_consumidor, 
        '¿Tienen descuento si compro más de 10 unidades?', 
        'PENDIENTE',
        CURRENT_TIMESTAMP - INTERVAL '3 hours'
    );

    -- Producto 17: Jabón Ecológico de Caléndula (Subcategoría 11: Jabones naturales)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 11, 'Jabón de Caléndula y Oliva', 'jabon-calendula-oliva', 'Jabón corporal saponificado en frío, ideal para pieles sensibles y libre de químicos.', 190.00, 20);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/jabon.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    ( currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 18: Canasta de Mimbre Mediana (Subcategoría 14: Mimbre)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 14, 'Canasta de Mimbre Tejida', 'canasta-mimbre-tejida', 'Canasta reforzada tejida a mano con mimbre natural del río.', 720.00, 5);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/canasta.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    ( currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 19: Chutney de Manzana y Especias (Subcategoría 9: Conservas)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 9, 'Chutney de Manzana Agridulce', 'chutney-manzana-agridulce', 'Acompañamiento agridulce elaborado artesanalmente con frutas locales de estación.', 280.00, 12);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/chutney.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 10),  -- Sin conservantes
    ( currval('productos_id_producto_seq'), 11),  -- Sin aditivos artificiales
    ( currval('productos_id_producto_seq'), 14),  -- Sin gluten
    ( currval('productos_id_producto_seq'), 17);  -- Vegano

    -- Producto 20: Tabla de Picar de Madera Recuperada (Subcategoría 16: Madera)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 16, 'Tabla para Picar de Olivo', 'tabla-picar-olivo', 'Tabla rústica confeccionada a mano a partir de maderas caídas y tratada con cera de abejas.', 890.00, 4);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/tabla.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    ( currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 21: Mermelada de Higo Casera (Subcategoría 9: Conservas)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 9, 'Mermelada de Higo de la Higuera', 'mermelada-higo-higuera', 'Dulce artesanal con fruta en trozos, baja en azúcar y sin gelatinas industriales.', 240.00, 15);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/mermelada_higo.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 10),   -- Sin conservantes (10), Sin aditivos artificiales (11), Vegano (17), Sin gluten (14)
    ( currval('productos_id_producto_seq'), 17),  
    ( currval('productos_id_producto_seq'), 14);  

    -- Producto 22: Bálsamo Labial de Coco (Subcategoría 11: Jabones y cosmética)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 11, 'Bálsamo Labial Humectante', 'balsamo-labial-humectante', 'Protector labial de manteca de cacao, aceite de coco virgen y extracto de vainilla.', 110.00, 25);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/balsamo_labial.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 12),   -- Materiales naturales (12), Biodegradable (13), Artesanal (9)
    ( currval('productos_id_producto_seq'), 9);  

    -- Producto 23: Mate de Madera de Caldén (Subcategoría 16: Madera)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 16, 'Mate de Caldén Torneado', 'mate-calden-torneado', 'Mate rústico torneado a mano, curado con aceites vegetales finos.', 420.00, 6);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/mate_calden.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 24: Pan Masamadre Integral (Subcategoría 8: Panificados - Nueva o similar)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 9, 'Pan de Masa Madre Integral', 'pan-masamadre-integral', 'Fermentación lenta de 24 horas, harina orgánica molida a piedra e hidratación alta.', 160.00, 14);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/pan_masamadre.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES  
    ( currval('productos_id_producto_seq'), 17),-- 9. Conservas: Sin conservantes (10), Sin aditivos artificiales (11), Vegano (17), Sin gluten (14)
    ( currval('productos_id_producto_seq'), 14);

    -- Producto 25: Champú Sólido Ortiga y Romero (Subcategoría 11: Jabones naturales)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 11, 'Champú Sólido Anticaída', 'champu-solido-anticaida', 'Fórmula natural concentrada con extractos botánicos de romero, ortiga y arcilla verde.', 270.00, 18);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/champu_solido.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 26: Posaplatos de Mimbre Chato (Subcategoría 14: Mimbre)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 14, 'Individuales de Mimbre x2', 'individuales-mimbre-x2', 'Set de dos posaplatos individuales tejidos planos con guía de mimbre tierno.', 340.00, 10);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/individuales_mimbre.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 27: Florero Rústico de Gres (Subcategoría 15: Cerámica)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 15, 'Florero de Gres Esmaltado', 'florero-gres-esmaltado', 'Cerámica de alta temperatura con esmaltes únicos formulados a base de cenizas.', 680.00, 3);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/no_image.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 28: Berenjenas en Escabeche (Subcategoría 9: Conservas)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 9, 'Berenjenas en Escabeche Especiadas', 'berenjenas-escabeche-especiadas', 'Receta tradicional en aceite de girasol, vinagre de manzana, ajo y especias selectas.', 310.00, 16);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/berenjenas_escabeche.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 10),  -- Sin conservantes
    ( currval('productos_id_producto_seq'), 14);  -- Sin gluten

    -- Producto 29: Galletitas Secas de Avena y Pasas (Subcategoría 9: Panificados/Snacks)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 9, 'Galletas de Avena y Pasas 250g', 'galletas-avena-pasas-250g', 'Endulzadas naturalmente con miel orgánica, súper crocantes y nutritivas.', 145.00, 22);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/galletas_avena.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 10);  

    -- Producto 30: Desodorante Natural de Salvia (Subcategoría 11: Jabones y cosmética)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 11, 'Desodorante de Salvia Sólido', 'desodorante-salvia-solido', 'Libre de aluminio y parabenos, con aceites esenciales puros y bicarbonato sutil.', 210.00, 15);
    
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES
    ( currval('productos_id_producto_seq'), 1, '/productos/no_image.webp');

    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9),   -- Artesanal
    ( currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 31: Frutillas Agroecológicas
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 2, 'Frutillas de Huerta x kg', 'frutillas-de-huerta-kg', 'Frutillas dulces y carnosas cultivadas en suelo vivo sin pesticidas químicos.', 280.00, 15);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/frutillas.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1), ( currval('productos_id_producto_seq'), 3), 
    ( currval('productos_id_producto_seq'), 19), ( currval('productos_id_producto_seq'), 2);

    -- Producto 32: Limón Sutil de Estación
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 2, 'Limón Sutil Agroecológico kg', 'limon-sutil-agroecologico-kg', 'Limones muy jugosos de producción propia, ideales para aderezos y jugos naturales.', 150.00, 40);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/limones.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1), ( currval('productos_id_producto_seq'), 3), ( currval('productos_id_producto_seq'), 19);

    -----------------------------------------------------------------------------------------
    -- SUBCATEGORÍA 5: LÁCTEOS ARTESANALES (Artesano - Juan Ambos)
    -- Etiquetas permitidas: Artesanal (9), Sin lactosa (16), Sin gluten (14), Sin conservantes (10)
    -----------------------------------------------------------------------------------------
    
    -- Producto 33: Queso Criollo Estacionado
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 5, 'Queso Criollo Artesanal kg', 'queso-criollo-artesanal-kg', 'Queso de leche cruda de vacas de pastoreo, madurado de forma natural.', 680.00, 12);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/queso_criollo.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 9), ( currval('productos_id_producto_seq'), 14), ( currval('productos_id_producto_seq'), 10);

    -----------------------------------------------------------------------------------------
    -- SUBCATEGORÍA 7: HIERBAS MEDICINALES (Huertero - Juan Huerta)
    -- Etiquetas permitidas: Cosecha silvestre (8), Sin aditivos artificiales (11), Agroecológico (6)
    -----------------------------------------------------------------------------------------
    
    -- Producto 34: Carqueja Deshidratada para Infusión
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 7, 'Hierba Carqueja Seca 100g', 'hierba-carqueja-seca-100g', 'Hojas recolectadas a mano en ambientes serranos puros y secadas a la sombra.', 90.00, 30);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/carqueja.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 8), ( currval('productos_id_producto_seq'), 11), ( currval('productos_id_producto_seq'), 6);

    -- Producto 35: Mix de Hierbas Relajantes
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 7, 'Mix Infusión Calma Intensa', 'mix-infusion-calma-intensa', 'Combinación equilibrada de melisa, pasionaria y manzanilla agroecológica.', 120.00, 25);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/no_image.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 11), ( currval('productos_id_producto_seq'), 6);

    -----------------------------------------------------------------------------------------
    -- SUBCATEGORÍA 8: SEMILLAS CRIOLLAS (Huertero - Juan Huerta)
    -- Etiquetas permitidas: Local (1), Sin agroquímicos (3), Producción familiar (2)
    -----------------------------------------------------------------------------------------
    
    -- Producto 36: Semillas de Maíz Amarillo Criollo
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 8, 'Semillas Maíz Criollo 200g', 'semillas-maiz-criollo-200g', 'Semilla nativa multiplicada agroecológicamente para siembra y conservación de variedad.', 160.00, 50);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/semillas_maiz.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1), ( currval('productos_id_producto_seq'), 3), ( currval('productos_id_producto_seq'), 2);

    -- Producto 37: Semillas de Zapallo Plomo Nativo
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 8, 'Semillas Zapallo Plomo x30u', 'semillas-zapallo-plomo-30u', 'Alta tasa de germinación, seleccionadas de los mejores frutos de la cosecha familiar.', 80.00, 40);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/semillas_zapallo.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 1), ( currval('productos_id_producto_seq'), 3), ( currval('productos_id_producto_seq'), 2);

    -----------------------------------------------------------------------------------------
    -- SUBCATEGORÍA 10: FERMENTADOS (Artesano - Juan Ambos)
    -- Etiquetas permitidas: Sin conservantes (10), Vegano (17), Artesanal (9)
    -----------------------------------------------------------------------------------------
    
    -- Producto 38: Chucrut Tradicional Fermentado
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 10, 'Chucrut Vivo Artesanal 360g', 'chucrut-vivo-artesanal-360g', 'Repollo blanco fermentado en agua y sal marina. Probiótico natural sin pasteurizar.', 290.00, 15);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/chucrut.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 10), ( currval('productos_id_producto_seq'), 17), ( currval('productos_id_producto_seq'), 9);

    -----------------------------------------------------------------------------------------
    -- SUBCATEGORÍA 12: TINTURAS MADRE (Artesano - Juan Ambos)
    -- Etiquetas permitidas: Cosecha silvestre (8), Materiales naturales (12), Artesanal (9)
    -----------------------------------------------------------------------------------------
    
    -- Producto 39: Tintura Madre de Propóleo
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 12, 'Tintura Madre Propóleo Puro', 'tintura-madre-propoleo-puro', 'Extracto hidroalcohólico concentrado, excelente antibiótico e inmunomodulador natural.', 320.00, 20);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/no_image.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 8), ( currval('productos_id_producto_seq'), 12), ( currval('productos_id_producto_seq'), 9);

    -- Producto 40: Tintura Madre de Diente de León
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 12, 'Tintura Diente de León 50ml', 'tintura-diente-de-leon-50ml', 'Depurativo hepático natural elaborado artesanalmente a partir de raíces silvestres.', 260.00, 14);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/no_image.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 8), ( currval('productos_id_producto_seq'), 12), ( currval('productos_id_producto_seq'), 9);

    -----------------------------------------------------------------------------------------
    -- SUBCATEGORÍA 13: BAMBÚ (Artesano - Juan Ambos)
    -- Etiquetas permitidas: Materiales naturales (12), Biodegradable (13), Artesanal (9)
    -----------------------------------------------------------------------------------------
    
    -- Producto 41: Sorbetes Reutilizables de Bambú
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 13, 'Pack 4 Sorbetes de Bambú', 'pack-4-sorbetes-bambu', 'Sorbetes pulidos a mano ecológicos, alternativos al plástico, incluye cepillo limpiador.', 180.00, 30);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/sorbetes_bambu.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 12), ( currval('productos_id_producto_seq'), 13), ( currval('productos_id_producto_seq'), 9);

    -- Producto 42: Jabonera Rustica de Caña Bambú
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_ambos, 13, 'Jabonera de Bambú Drenante', 'jabonera-bambu-drenante', 'Diseño ranurado que optimiza la ventilación de tus cosméticos sólidos impidiendo hongos.', 220.00, 15);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/jabonera_bambu.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 12), ( currval('productos_id_producto_seq'), 13), ( currval('productos_id_producto_seq'), 9);

    -----------------------------------------------------------------------------------------
    -- SUBCATEGORÍA 18: LOMBRICULTURA (Huertero - Juan Huerta)
    -- Etiquetas permitidas: Biodegradable (13), Local (1), Producción familiar (2)
    -----------------------------------------------------------------------------------------
    
    -- Producto 43: Núcleo de Lombrices California Rojas
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 18, 'Núcleo Lombrices Rojas x100u', 'nucleo-lombrices-rojas-100u', 'Lombrices adultas, juveniles y cocones en su propio ecosistema para iniciar tu compostera.', 350.00, 20);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/lombrices.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 13), ( currval('productos_id_producto_seq'), 1), ( currval('productos_id_producto_seq'), 2);

    -----------------------------------------------------------------------------------------
    -- SUBCATEGORÍA 19: INSUMOS AGROECOLÓGICOS (Huertero - Juan Huerta)
    -- Etiquetas permitidas: Agroecológico (6), Sin agroquímicos (3), Local (1)
    -----------------------------------------------------------------------------------------
    
    -- Producto 44: Jabón Potásico Concentrado
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 19, 'Jabón Potásico Neem 250cc', 'jabon-potasico-neem-250cc', 'Insecticida y acaricida natural orgánico preventivo para el control biológico de plagas.', 240.00, 25);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/no_image.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 6), ( currval('productos_id_producto_seq'), 3), ( currval('productos_id_producto_seq'), 1);

    -- Producto 45: Purín de Ortiga Fermentado
    INSERT INTO productos (id_productor, id_subcategoria, nombre, producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_productor, 19, 'Purín de Ortiga Bioestimulante', 'purin-ortiga-bioestimulante', 'Fortalece las defensas naturales y aporta nitrógeno asimilable a tus cultivos huerteros.', 180.00, 15);
    INSERT INTO producto_imagenes ( id_producto, posicion, path) VALUES ( currval('productos_id_producto_seq'), 1, '/productos/purin_ortiga.webp');
    INSERT INTO producto_etiquetas ( id_producto, id_etiqueta) VALUES 
    ( currval('productos_id_producto_seq'), 6), ( currval('productos_id_producto_seq'), 3), ( currval('productos_id_producto_seq'), 1);

    RAISE NOTICE 'Se dieron de alta varios productos con etiquetas asociadas.';
END $$;

