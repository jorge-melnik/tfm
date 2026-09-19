DO $$
DECLARE
    id_administrador UUID;
    id_superadministrador UUID;
    id_productor UUID;
    id_consumidor UUID;
    id_ambos UUID;

    v_id_localidad_salto INTEGER;
    v_id_localidad_paysandu INTEGER;
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

    SELECT l.id_localidad INTO v_id_localidad_paysandu
    FROM localidades l
    JOIN departamentos d ON l.id_departamento = d.id_departamento
    WHERE UPPER(d.departamento) = 'PAYSANDU' AND UPPER(l.localidad) = 'PAYSANDU'
    LIMIT 1;

    ------------------------------------------------------------------------------------------------------------------------
    -- admin: Solo ADMIN
    -------------------------------------------------------------------------------------------------------------------------
    INSERT INTO usuarios (rol_actual, roles) VALUES ('ADMIN', ARRAY['ADMIN']::ROL[]) RETURNING id_usuario INTO id_administrador;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular,foto_url) 
        VALUES (id_administrador, 'Admin', 'Sistema', 'admin@agroeco.com', 'admin', '+59899111222', '/usuarios/admin/admin.png');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_administrador, crypt('Contraseña', gen_salt('bf', 10)));
    ------------------------------------------------------------------------------------------------------------------------
    -- superadmin: Administrador, productor y consumidor
    -------------------------------------------------------------------------------------------------------------------------
    INSERT INTO usuarios (rol_actual, roles) VALUES ('ADMIN', ARRAY['ADMIN']::ROL[]) RETURNING id_usuario INTO id_superadministrador;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular,foto_url) VALUES (id_superadministrador, 'superadmin', 'superadmin', 'superadmin@agroeco.com', 'superadmin', '+59899111662', '/usuarios/superadmin/superadmin.svg');
    INSERT INTO consumidores (id_consumidor) VALUES (id_superadministrador);
    INSERT INTO carritos (id_consumidor) VALUES (id_superadministrador);
-- Ubicaciones Superadmin
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud) 
        VALUES (id_superadministrador, v_id_localidad_salto, 'Chacra Salto', 'superadmin-loc-1', 'Av. Rodó 1250', 'Punto de recolección', -31.3552689080243, -57.942468748402504) 
        RETURNING id_ubicacion INTO v_id_ubicacion_superadmin
    ;-- SALTO
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud) 
        VALUES (id_superadministrador, v_id_localidad_paysandu, 'Local Paysandú', 'superadmin-loc-2', 'Av. España 430', 'APTO PAYSANDU', -32.31637463376413, -58.08884698512548) 
    ;-- PAYSANDU

    INSERT INTO productores (id_productor, presentacion,id_ubicacion) VALUES (id_superadministrador, 'Productor artesanal de cosas.', v_id_ubicacion_superadmin);
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_superadministrador, crypt('Contraseña', gen_salt('bf', 10)));

    -- productor: Solo productor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('PRODUCTOR', ARRAY['PRODUCTOR']::ROL[]) RETURNING id_usuario INTO id_productor;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username,celular,foto_url) 
        VALUES (id_productor, 'Juan', 'Huerta', 'productor@agroeco.com','productor', '+59899333444','/usuarios/productor/productor.jpeg');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_productor, crypt('Contraseña', gen_salt('bf', 10)));

    -- Ubicaciones Productor
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
        VALUES (id_productor, v_id_localidad_paysandu, 'HUERTA', 'huerta', 'Camino Departamental Km 12', 'Producción de hortalizas', -32.333556818498074, -58.01283505601679) 
        RETURNING id_ubicacion INTO v_id_ubicacion_productor
    ; -- PAYSANDU
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
        VALUES (id_productor, v_id_localidad_paysandu, 'CASA', 'casa', 'Avenida Barbieri 820', 'mi casucha', -32.319840143358064, -58.080780099872364)
    ; -- PAYSANDU

    INSERT INTO productores (id_productor, presentacion, id_ubicacion) VALUES (id_productor, 'Productor de hortalizas orgánicas y miel pura de campo.',v_id_ubicacion_productor);

    -- Consumidor: Solo consumidor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('CONSUMIDOR', ARRAY['CONSUMIDOR']::ROL[]) RETURNING id_usuario INTO id_consumidor;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular,foto_url) 
        VALUES (id_consumidor, 'María', 'Compradora', 'consumidor@agroeco.com', 'consumidor' ,'+59899555666', '/usuarios/consumidor/consumidor.jpeg');
    INSERT INTO consumidores (id_consumidor) VALUES (id_consumidor);
    INSERT INTO carritos (id_consumidor) VALUES (id_consumidor);
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_consumidor, crypt('Contraseña', gen_salt('bf', 10)));
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
        VALUES (id_consumidor, v_id_localidad_salto, 'CASA', 'casa', 'Camino Departamental Km 12', '', -31.395785119683822, -57.96021209841166) 
    ; -- SALTO
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
        VALUES (id_consumidor, v_id_localidad_paysandu, 'ABUELA', 'abuela', 'Avenida Solari 820', '', -32.322466081974916, -58.087187638403044)
    ; -- PAYSANDU

    -- ambos: Productor y consumidor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('CONSUMIDOR', ARRAY['CONSUMIDOR']::ROL[]) RETURNING id_usuario INTO id_ambos;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular,foto_url) 
        VALUES (id_ambos, 'Juan', 'Ambos', 'ambos@email.com', 'ambos' ,'+59899555777', '/usuarios/ambos/ambos.png');
    INSERT INTO consumidores (id_consumidor) VALUES (id_ambos);
    INSERT INTO carritos (id_consumidor) VALUES (id_ambos);
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_ambos, crypt('Contraseña', gen_salt('bf', 10)));
    
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
        VALUES (id_ambos, v_id_localidad_salto, 'PREDIO', 'predio', 'Camino Departamental Km 32', 'Sin comentarios', -31.35848187104505, -57.88135954000063) 
        RETURNING id_ubicacion INTO v_id_ubicacion_ambos
    ; -- SALTO
    INSERT INTO ubicaciones (id_usuario, id_localidad, nombre, ubicacion, direccion, comentarios, latitud, longitud)
        VALUES (id_ambos, v_id_localidad_salto, 'HOME SWEET HOME', 'home-sweet-home', 'Avenida Barbieri 120', 'Mi casita', -31.383477281884524, -57.89840104372805)
    ; -- SALTO

    INSERT INTO productores (id_productor, presentacion, id_ubicacion) VALUES (id_ambos, 'Productor artesanal de cosas.', v_id_ubicacion_ambos);
    
    RAISE NOTICE 'Usuarios fecha_creacion: Admin (%), Productor (%), Consumidor (%)', id_administrador, id_productor, id_consumidor;
END $$;