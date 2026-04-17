
INSERT INTO public.categorias(nombre, slug_categoria, descripcion) VALUES 
('Alimentos frescos', 'alimentos-frescos', 'Productos obtenidos directamente de la huerta y granja sin procesos industriales.'),
('Plantas y semillas', 'plantas-y-semillas', 'Variedad de semillas orgánicas, plantines y especies para cultivo regenerativo.'),
('Productos elaborados', 'productos-elaborados', 'Alimentos que han pasado por un proceso de transformación artesanal.'),
('Artesanías de materiales naturales', 'artesanias-de-materiales-naturales', 'Objetos hechos a mano utilizando fibras, madera y otros elementos de la naturaleza.'),
('Otros productos regenerativos', 'otros-productos-regenerativos', 'Cualquier otro producto que contribuya a la salud del suelo y el ecosistema.')
;

INSERT INTO public.subcategorias(id_categoria, nombre, slug_subcategoria) VALUES 
(1, 'Verduras', 'verduras'),
(1, 'Frutas', 'frutas'),
(1, 'Huevos', 'huevos'),
(1, 'Miel', 'miel'),
(1, 'Lácteos artesanales', 'lacteos-artesanales'),

(2, 'Plantines', 'plantines'),
(2, 'hierbas medicinales', 'hierbas-medicinales'),
(2, 'semillas criollas', 'semillas-criollas'),

(3, 'conservas', 'conservas'),
(3, 'fermentados', 'fermentados'),
(3, 'jabones naturales', 'jabones-naturales'),
(3, 'tinturas', 'tinturas'),

(4, 'bambú', 'bambu'),
(4, 'mimbre', 'mimbre'),
(4, 'cerámica', 'ceramica'),
(4, 'madera', 'madera'),

(5, 'compost', 'compost'),
(5, 'lombricultura', 'lombricultura'),
(5, 'insumos agroecológicos', 'insumos-agroecologicos')
;

INSERT INTO public.etiquetas (nombre, slug_etiqueta) VALUES 
('etiqueta1', 'etiqueta1'),
('etiqueta2', 'etiqueta2'),
('etiqueta3', 'etiqueta3'),
('etiqueta4', 'etiqueta4')
;

INSERT INTO public.subcategoria_etiquetas (id_subcategoria,id_etiqueta) VALUES
(1,1),(1,2),(1,3),      -- 1 Verduras
(2,4),(2,2),(2,3),      -- 2 Frutas 
(3,4),(3,2),(3,3),      -- 3 Huevos 
(4,4),(4,2),(4,3),      -- 4 Miel 
(5,4),(5,2),(5,3),      -- 5 Lácteos artesanales 
(6,4),(6,2),(6,3),      -- 6 Plantines 
(7,4),(7,2),(7,3),      -- 7 hierbas medicinales
(8,4),(8,2),(8,3),      -- 8 semillas criollas 
(9,4),(9,2),(9,3),      -- 9 conservas 
(10,4),(10,2),(10,3),   -- 10 fermentados 
(11,4),(11,2),(11,3),   -- 11 jabones naturales 
(12,4),(12,2),(12,3),   -- 12 tinturas 
(13,4),(13,2),(13,3),   -- 13 bambú 
(14,4),(14,2),(14,3),   -- 14 mimbre 
(15,4),(15,2),(15,3),   -- 15 cerámica 
(16,4),(16,2),(16,3),   -- 16 madera 
(17,4),(17,2),(17,3),   -- 17 compost 
(18,4),(18,2),(18,3),   -- 18 lombricultura 
(19,4),(19,2),(19,3)    -- 19 insumos agroecológicos 
;
