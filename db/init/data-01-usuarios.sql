DO $$
DECLARE
    id_administrador UUID;
    id_superadministrador UUID;
    id_productor UUID;
    id_consumidor UUID;
    id_ambos UUID;

    v_id_localidad_salto INTEGER;
    v_id_localidad_artigas INTEGER;

    v_id_ubicacion_superadmin INTEGER;
    v_id_ubicacion_productor INTEGER;
    v_id_ubicacion_ambos INTEGER;
BEGIN
    SELECT l.id_localidad INTO v_id_localidad_salto
    FROM localidades l
    JOIN departamentos d ON l.id_departamento = d.id_departamento
    WHERE UPPER(d.nombre) = 'SALTO' AND UPPER(l.nombre) = 'SALTO'
    LIMIT 1;

    SELECT l.id_localidad INTO v_id_localidad_artigas
    FROM localidades l
    JOIN departamentos d ON l.id_departamento = d.id_departamento
    WHERE UPPER(d.nombre) = 'ARTIGAS' AND UPPER(l.nombre) = 'ARTIGAS'
    LIMIT 1;


    --- admin: Solo ADMIN
    INSERT INTO usuarios (rol_actual, roles) VALUES ('ADMIN', ARRAY['ADMIN']::ROL[]) RETURNING id_usuario INTO id_administrador;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular,foto_url) 
        VALUES (id_administrador, 'Admin', 'Sistema', 'admin@deaca.com', 'admin', '+59899111222', '/usuarios/admin/admin.png');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_administrador, crypt('Contraseña', gen_salt('bf', 10)));

    -- superadmin: Administrador, productor y consumidor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('ADMIN', ARRAY['ADMIN']::ROL[]) RETURNING id_usuario INTO id_superadministrador;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular,foto_url) 
        VALUES (id_superadministrador, 'superadmin', 'superadmin', 'superadmin@deaca.com', 'superadmin', '+59899111662', '/usuarios/superadmin/superadmin.svg');
    INSERT INTO consumidores (id_consumidor) VALUES (id_superadministrador);
    INSERT INTO carritos (id_consumidor) VALUES (id_superadministrador);
    INSERT INTO productores (id_productor, presentacion) VALUES (id_superadministrador, 'Productor artesanal de cosas.');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_superadministrador, crypt('Contraseña', gen_salt('bf', 10)));
-- Ubicaciones Superadmin
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
    VALUES (id_superadministrador, v_id_localidad_salto, 'Chacra Salto', 'superadmin-loc-1', 'Av. Rodó 1250', 'Punto de recolección', -31.378000, -57.950000);
    
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
    VALUES (id_superadministrador, v_id_localidad_artigas, 'Local Paysandú', 'superadmin-loc-2', 'Av. España 430', 'Punto de entrega comercial', -32.315000, -58.080000);

    -- productor: Solo productor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('PRODUCTOR', ARRAY['PRODUCTOR']::ROL[]) RETURNING id_usuario INTO id_productor;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username,celular,foto_url) 
        VALUES (id_productor, 'Juan', 'Huerta', 'juan.productor@email.com','productor', '+59899333444','/usuarios/productor/productor.jpeg');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_productor, crypt('Contraseña', gen_salt('bf', 10)));

    -- Ubicaciones Productor
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
    VALUES (id_productor, v_id_localidad_salto, 'Huerta Principal', 'productor-loc-1', 'Camino Departamental Km 12', 'Invernaderos de hortalizas', -31.400000, -57.930000)
    RETURNING id_ubicacion INTO v_id_ubicacion_productor;
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
    VALUES (id_productor, v_id_localidad_salto, 'Puesto de Venta', 'productor-loc-2', 'Avenida Barbieri 820', 'Atención directa al público', -31.382000, -57.958000);

    INSERT INTO productores (id_productor, presentacion) VALUES (id_productor, 'Productor de hortalizas orgánicas y miel pura de campo.');

    -- Consumidor: Solo consumidor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('CONSUMIDOR', ARRAY['CONSUMIDOR']::ROL[]) RETURNING id_usuario INTO id_consumidor;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular,foto_url) 
        VALUES (id_consumidor, 'María', 'Compradora', 'maria.cliente@email.com', 'consumidor' ,'+59899555666', '/usuarios/consumidor/consumidor.jpeg');
    INSERT INTO consumidores (id_consumidor) VALUES (id_consumidor);
    INSERT INTO carritos (id_consumidor) VALUES (id_consumidor);
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_consumidor, crypt('Contraseña', gen_salt('bf', 10)));


    -- ambos: Productor y consumidor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('CONSUMIDOR', ARRAY['CONSUMIDOR']::ROL[]) RETURNING id_usuario INTO id_ambos;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular,foto_url) 
        VALUES (id_ambos, 'Juan', 'Ambos', 'ambos@email.com', 'ambos' ,'+59899555777', '/usuarios/ambos/ambos.png');
    INSERT INTO consumidores (id_consumidor) VALUES (id_ambos);
    INSERT INTO carritos (id_consumidor) VALUES (id_ambos);
    INSERT INTO productores (id_productor, presentacion) VALUES (id_ambos, 'Productor artesanal de cosas.');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_ambos, crypt('Contraseña', gen_salt('bf', 10)));

    RAISE NOTICE 'Usuarios fecha_creacion: Admin (%), Productor (%), Consumidor (%)', id_administrador, id_productor, id_consumidor;
END $$;