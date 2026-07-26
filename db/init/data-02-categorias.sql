
INSERT INTO public.categorias (nombre, categoria, descripcion, color, icono) VALUES 
(
  'Alimentos frescos', 
  'alimentos-frescos', 
  'Productos obtenidos directamente de la huerta y granja sin procesos industriales.', 
  '#22c55e', 
  'pi pi-shopping-bag'
),
(
  'Plantas y semillas', 
  'plantas-y-semillas', 
  'Variedad de semillas orgánicas, plantines y especies para cultivo regenerativo.', 
  '#15803d', 
  'pi pi-bolt'
),
(
  'Productos elaborados', 
  'productos-elaborados', 
  'Alimentos que han pasado por un proceso de transformación artesanal.', 
  '#f59e0b', 
  'pi pi-box'
),
(
  'Artesanías de materiales naturales', 
  'artesanias-naturales', 
  'Objetos hechos a mano utilizando fibras, madera y otros elementos de la naturaleza.', 
  '#b45309', 
  'pi pi-palette'
),
(
  'Otros productos regenerativos', 
  'otros-regenerativos', 
  'Cualquier otro producto que contribuya a la salud del suelo y el ecosistema.', 
  '#6366f1', 
  'pi pi-globe'
);

INSERT INTO public.subcategorias(id_categoria, nombre, subcategoria) VALUES 
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

INSERT INTO public.etiquetas (nombre, etiqueta, imagen) VALUES 
('Local', 'local', 'images/local.png'),
('Producción familiar', 'produccion-familiar', 'images/produccion-familiar.png'),
('Sin agroquímicos', 'sin-agroquimicos', 'images/sin-agroquimicos.png'),
('Certificado orgánico', 'certificado-organico', 'images/certificado-organico.png'),
('En transición orgánica', 'en-transicion-organica', 'images/en-transicion-organica.png'),
('Agroecológico', 'agroecologico', 'images/agroecologico.png'),
('En transición agroecologica', 'en-transicion-agroecologica', 'images/en-transicion-agroecologica.png'),
('Cosecha silvestre', 'cosecha-silvestre', 'images/cosecha-silvestre.png'),
('Artesanal', 'artesanal', 'images/artesanal.png'),
('Sin conservantes', 'sin-conservantes', 'images/sin-conservantes.png'),
('Sin aditivos artificiales', 'sin-aditivos-artificiales', 'images/sin-aditivos-artificiales.png'),
('Materiales naturales', 'materiales-naturales', 'images/materiales-naturales.png'),
('Biodegradable', 'biodegradable', 'images/biodegradable.png'),
('Sin gluten', 'sin-gluten', 'images/sin-gluten.png'),
('Sin azúcar', 'sin-azucar', 'images/sin-azucar.png'),
('Sin lactosa', 'sin-lactosa', 'images/sin-lactosa.png'),
('Vegano', 'vegano', 'images/vegano.png'),
('Vegetariano', 'vegetariano', 'images/vegetariano.png'),
('De estación', 'de-estacion', 'images/de-estacion.png')
;


INSERT INTO public.subcategoria_etiquetas (id_subcategoria, id_etiqueta) VALUES
-- 1. Verduras: Local (1), Sin agroquímicos (3), Agroecológico (6), De estación (19)
(1,1), (1,3), (1,6), (1,19),

-- 2. Frutas: Local (1), Sin agroquímicos (3), De estación (19), Producción familiar (2)
(2,1), (2,3), (2,19), (2,2),

-- 3. Huevos: Producción familiar (2), Sin agroquímicos (3), Local (1)
(3,2), (3,3), (3,1),

-- 4. Miel: Cosecha silvestre (8), Artesanal (9), Sin conservantes (10)
(4,8), (4,9), (4,10),

-- 5. Lácteos artesanales: Artesanal (9), Sin lactosa (16), Sin gluten (14), Sin conservantes (10)
(5,9), (5,16), (5,14), (5,10),

-- 6. Plantines: Sin agroquímicos (3), Local (1), Agroecológico (6)
(6,3), (6,1), (6,6),

-- 7. Hierbas medicinales: Cosecha silvestre (8), Sin aditivos artificiales (11), Agroecológico (6)
(7,8), (7,11), (7,6),

-- 8. Semillas criollas: Local (1), Sin agroquímicos (3), Producción familiar (2)
(8,1), (8,3), (8,2),

-- 9. Conservas: Sin conservantes (10), Sin aditivos artificiales (11), Vegano (17), Sin gluten (14)
(9,10), (9,11), (9,17), (9,14),

-- 10. Fermentados: Sin conservantes (10), Vegano (17), Artesanal (9)
(10,10), (10,17), (10,9),

-- 11. Jabones naturales: Materiales naturales (12), Biodegradable (13), Artesanal (9)
(11,12), (11,13), (11,9),

-- 12. Tinturas: Cosecha silvestre (8), Materiales naturales (12), Artesanal (9)
(12,8), (12,12), (12,9),

-- 13. Bambú: Materiales naturales (12), Biodegradable (13), Artesanal (9)
(13,12), (13,13), (13,9),

-- 14. Mimbre: Materiales naturales (12), Biodegradable (13), Artesanal (9)
(14,12), (14,13), (14,9),

-- 15. Cerámica: Materiales naturales (12), Artesanal (9), Local (1)
(15,12), (15,9), (15,1),

-- 16. Madera: Materiales naturales (12), Artesanal (9), Biodegradable (13)
(16,12), (16,9), (16,13),

-- 17. Compost: Biodegradable (13), Local (1), Agroecológico (6)
(17,13), (17,1), (17,6),

-- 18. Lombricultura: Biodegradable (13), Local (1), Producción familiar (2)
(18,13), (18,1), (18,2),

-- 19. Insumos agroecológicos: Agroecológico (6), Sin agroquímicos (3), Local (1)
(19,6), (19,3), (19,1);