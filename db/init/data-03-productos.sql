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
    -- Especializado en hortalizas orgánicas, plantines, miel, huevos y tierra.
    -----------------------------------------------------------------------------------------

    -- Producto 1: Miel Pura de Monte (Subcategoría 4: Miel)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 4, 'Miel Pura de Monte 1kg', 'miel-pura-monte-1kg', 'Miel cruda de abejas, cosechada de forma artesanal en montes nativos sin agroquímicos.', 450.00, 25);
    
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

    -- Producto 6: Atado de Acelga Ancha (Subcategoría 1: Verduras)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 1, 'Atado de Acelga Orgánica', 'atado-acelga-organica', 'Hojas verdes, carnosas y frescas recién cosechadas por la mañana.', 95.00, 20);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/acelga.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 6),   -- Agroecológico
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 19);  -- De estación

    -- Producto 7: Zapallo Anco por kg (Subcategoría 1: Verduras)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 1, 'Zapallo Anco Agroecológico kg', 'zapallo-anco-agroecologico-kg', 'Zapallos dulces de pulpa firme, ideales para puré o al horno.', 110.00, 60);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/zapallo.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 3);   -- Sin agroquímicos

    -- Producto 8: Miel con Panal de Abeja (Subcategoría 4: Miel)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 4, 'Miel con Panal Artesanal 500g', 'miel-panal-artesanal-500g', 'Frasco premium que incluye un trozo de panal 100% comestible y natural.', 380.00, 10);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/miel_panal.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 10);  -- Sin conservantes

    -- Producto 9: Plantín de Morrón Rojo (Subcategoría 6: Plantines)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 6, 'Plantín de Morrón Rojo', 'plantin-morron-rojo', 'Plantines vigorosos con excelente sistema radicular, listos para tu huerta.', 85.00, 25);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/plantin_morron.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 6);   -- Agroecológico

    -- Producto 10: Humus de Lombriz Líquido (Subcategoría 17: Compost)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 17, 'Humus Líquido Lixiviado 1L', 'humus-liquido-lixiviado-1l', 'Fertilizante foliar y radicular orgánico de rápida absorción para potenciar tus plantas.', 190.00, 18);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/humus_liquido.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 6),   -- Agroecológico
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 11: Atado de Flores Benéficas (Subcategoría 6: Plantines)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 6, 'Mix Flores para Huerta (Copetes)', 'mix-flores-huerta-copetes', 'Plantines de copetes y caléndulas, ideales para control biológico de plagas.', 140.00, 15);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/copetes.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 3);   -- Sin agroquímicos

    -- Producto 12: Frasco de Polen Seco (Subcategoría 4: Miel)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 4, 'Polen de Abeja Granulado 150g', 'polen-abeja-granulado-150g', 'Superalimento natural energizante, recolectado en zonas libres de contaminación.', 290.00, 12);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/polen.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 8),   -- Cosecha silvestre
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 10);  -- Sin conservantes

    -- Producto 13: Bolsa de Tierra Preparada (Subcategoría 17: Compost)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 17, 'Substrato Huerta Orgánica 10dm3', 'substrato-huerta-organica-10dm3', 'Mezcla óptima de tierra negra, compost maduro, perlita y turba local.', 220.00, 25);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/tierra_preparada.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 14: Cabezas de Ajo Morado (Subcategoría 1: Verduras)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 1, 'Riestra de Ajo Morado x3', 'riestra-ajo-morado-x3', 'Ajos de aroma intenso, curados al sol, ideales para conservación prolongada.', 130.00, 35);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/ajos.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 19);  -- De estación

    -- Producto 15: Plantín de Menta Peperina (Subcategoría 6: Plantines)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_huerta, 6, 'Plantín de Menta Peperina', 'plantin-menta-peperina', 'Planta aromática medicinal ideal para el mate o infusiones frescas.', 75.00, 30);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1, 'productos/peperina.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_huerta, currval('productos_id_producto_seq'), 3);   -- Sin agroquímicos


    -----------------------------------------------------------------------------------------
    -- PRODUCTOS DE JUAN AMBOS (id_productor: v_id_juan_ambos)
    -- Productor artesanal: Cerámica, Mimbre, Madera, Conservas, Cosmética y Panificados.
    -----------------------------------------------------------------------------------------

    -- Producto 16: Cuenco de Cerámica de Arcilla Local (Subcategoría 15: Cerámica)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 15, 'Cuenco de Cerámica Artesanal', 'cuenco-ceramica-artesanal', 'Modelado a mano con arcilla de cañada local, horneado a leña.', 550.00, 8);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/cuenco1.webp'),
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 2, 'productos/cuenco2.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 17: Jabón Ecológico de Caléndula (Subcategoría 11: Jabones naturales)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 11, 'Jabón de Caléndula y Oliva', 'jabon-calendula-oliva', 'Jabón corporal saponificado en frío, ideal para pieles sensibles y libre de químicos.', 190.00, 20);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/jabon.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 18: Canasta de Mimbre Mediana (Subcategoría 14: Mimbre)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 14, 'Canasta de Mimbre Tejida', 'canasta-mimbre-tejida', 'Canasta reforzada tejida a mano con mimbre natural del río.', 720.00, 5);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/canasta.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 19: Chutney de Manzana y Especias (Subcategoría 9: Conservas)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 9, 'Chutney de Manzana Agridulce', 'chutney-manzana-agridulce', 'Acompañamiento agridulce elaborado artesanalmente con frutas locales de estación.', 280.00, 12);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/chutney.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 10),  -- Sin conservantes
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 11),  -- Sin aditivos artificiales
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 14),  -- Sin gluten
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 17);  -- Vegano

    -- Producto 20: Tabla de Picar de Madera Recuperada (Subcategoría 16: Madera)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 16, 'Tabla para Picar de Olivo', 'tabla-picar-olivo', 'Tabla rústica confeccionada a mano a partir de maderas caídas y tratada con cera de abejas.', 890.00, 4);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/tabla.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12),  -- Materiales naturales
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 21: Mermelada de Higo Casera (Subcategoría 9: Conservas)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 9, 'Mermelada de Higo de la Higuera', 'mermelada-higo-higuera', 'Dulce artesanal con fruta en trozos, baja en azúcar y sin gelatinas industriales.', 240.00, 15);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/mermelada_higo.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1),   -- Local
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 10),  -- Sin conservantes
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 17);  -- Vegano

    -- Producto 22: Bálsamo Labial de Coco (Subcategoría 11: Jabones y cosmética)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 11, 'Bálsamo Labial Humectante', 'balsamo-labial-humectante', 'Protector labial de manteca de cacao, aceite de coco virgen y extracto de vainilla.', 110.00, 25);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/balsamo_labial.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 23: Mate de Madera de Caldén (Subcategoría 16: Madera)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 16, 'Mate de Caldén Torneado', 'mate-calden-torneado', 'Mate rústico torneado a mano, curado con aceites vegetales finos.', 420.00, 6);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/mate_calden.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 24: Pan Masamadre Integral (Subcategoría 8: Panificados - Nueva o similar)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 9, 'Pan de Masa Madre Integral', 'pan-masamadre-integral', 'Fermentación lenta de 24 horas, harina orgánica molida a piedra e hidratación alta.', 160.00, 14);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/pan_masamadre.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 11);  -- Sin aditivos artificiales

    -- Producto 25: Champú Sólido Ortiga y Romero (Subcategoría 11: Jabones naturales)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 11, 'Champú Sólido Anticaída', 'champu-solido-anticaida', 'Fórmula natural concentrada con extractos botánicos de romero, ortiga y arcilla verde.', 270.00, 18);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/champu_solido.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    -- Producto 26: Posaplatos de Mimbre Chato (Subcategoría 14: Mimbre)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 14, 'Individuales de Mimbre x2', 'individuales-mimbre-x2', 'Set de dos posaplatos individuales tejidos planos con guía de mimbre tierno.', 340.00, 10);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/individuales_mimbre.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 27: Florero Rústico de Gres (Subcategoría 15: Cerámica)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 15, 'Florero de Gres Esmaltado', 'florero-gres-esmaltado', 'Cerámica de alta temperatura con esmaltes únicos formulados a base de cenizas.', 680.00, 3);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/florero_gres.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 12);  -- Materiales naturales

    -- Producto 28: Berenjenas en Escabeche (Subcategoría 9: Conservas)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 9, 'Berenjenas en Escabeche Especiadas', 'berenjenas-escabeche-especiadas', 'Receta tradicional en aceite de girasol, vinagre de manzana, ajo y especias selectas.', 310.00, 16);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/berenjenas_escabeche.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 10),  -- Sin conservantes
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 14);  -- Sin gluten

    -- Producto 29: Galletitas Secas de Avena y Pasas (Subcategoría 9: Panificados/Snacks)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 9, 'Galletas de Avena y Pasas 250g', 'galletas-avena-pasas-250g', 'Endulzadas naturalmente con miel orgánica, súper crocantes y nutritivas.', 145.00, 22);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/galletas_avena.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 11);  -- Sin aditivos artificiales

    -- Producto 30: Desodorante Natural de Salvia (Subcategoría 11: Jabones y cosmética)
    INSERT INTO productos (id_productor, id_subcategoria, nombre, slug_producto, descripcion, precio, cantidad_disponible)
    VALUES (v_id_juan_ambos, 11, 'Desodorante de Salvia Sólido', 'desodorante-salvia-solido', 'Libre de aluminio y parabenos, con aceites esenciales puros y bicarbonato sutil.', 210.00, 15);
    
    INSERT INTO producto_imagenes (id_productor, id_producto, posicion, path) VALUES
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 1, 'productos/desodorante_salvia.webp');

    INSERT INTO producto_etiquetas (id_productor, id_producto, id_etiqueta) VALUES 
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 9),   -- Artesanal
    (v_id_juan_ambos, currval('productos_id_producto_seq'), 13);  -- Biodegradable

    RAISE NOTICE '¡Excelente! Se han cargado exitosamente los 30 productos con sus respectivas imágenes y etiquetas distribuidas de manera proporcional.';
END $$;