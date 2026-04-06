
INSERT INTO public.categorias(nombre, descripcion) VALUES 
('Alimentos frescos','Alimentos frescos'),                   --1
('Plantas y semillas','Plantas y semillas'),                 --2
('Productos elaborados','Productos elaborados'),             --3
('Artesanías de materiales naturales','Artesanías de materiales naturales'),  --4
('Otros productos regenerativos','Otros productos regenerativos')        --5
;

INSERT INTO public.subcategorias(id_categoria, nombre) VALUES 
(1,'Verduras'),             -- 1
(1,'Frutas'),               -- 2
(1,'Huevos'),               -- 3
(1,'Miel'),                 -- 4
(1,'Lácteos artesanales'),  -- 5

(2,'Plantines'),            -- 6
(2,'hierbas medicinales'),  -- 7
(2,'semillas criollas'),    -- 8

(3,'conservas'),            -- 9
(3,'fermentados'),          -- 10
(3,'jabones naturales'),    -- 11
(3,'tinturas'),             -- 12

(4,'bambú'),                -- 13
(4,'mimbre'),               -- 14
(4,'cerámica'),             -- 15
(4,'madera'),               -- 16

(5,'compost'),              -- 17
(5,'lombricultura'),        -- 18
(5,'insumos agroecológicos')-- 19
;

-- TODO: Insertar etiquetas
INSERT INTO public.etiquetas (nombre) VALUES 
('etiqueta1'),
('etiqueta2'),
('etiqueta3'),
('etiqueta4')
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
