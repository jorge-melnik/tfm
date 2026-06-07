DO $$
DECLARE
    id_administrador UUID;
    id_superadministrador UUID;
    id_productor UUID;
    id_consumidor UUID;
    id_ambos UUID;
BEGIN
    --- 1. ALTA DE ADMINISTRADOR
    INSERT INTO usuarios (rol_actual, roles) VALUES ('ADMIN', ARRAY['ADMIN']::ROL[]) RETURNING id_usuario INTO id_administrador;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular) 
        VALUES (id_administrador, 'Admin', 'Sistema', 'admin@deaca.com', 'admin', '+59899111222');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_administrador, crypt('Contraseña', gen_salt('bf', 10)));

    -- Administrador, productor y consumidor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('ADMIN', ARRAY['ADMIN']::ROL[]) RETURNING id_usuario INTO id_superadministrador;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular) 
        VALUES (id_superadministrador, 'superadmin', 'superadmin', 'superadmin@deaca.com', 'superadmin', '+59899111662');
    INSERT INTO consumidores (id_consumidor) VALUES (id_superadministrador);
    INSERT INTO productores (id_productor, presentacion) VALUES (id_superadministrador, 'Productor artesanal de cosas.');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_superadministrador, crypt('Contraseña', gen_salt('bf', 10)));

    -- Alta de productor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('PRODUCTOR', ARRAY['PRODUCTOR']::ROL[]) RETURNING id_usuario INTO id_productor;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username,celular) 
        VALUES (id_productor, 'Juan', 'Huerta', 'juan.productor@email.com','productor', '+59899333444');
    INSERT INTO productores (id_productor, presentacion) VALUES (id_productor, 'Productor de hortalizas orgánicas y miel pura de campo.');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_productor, crypt('Contraseña', gen_salt('bf', 10)));

    -- Alta de consumidor
    INSERT INTO usuarios (rol_actual, roles) VALUES ('CONSUMIDOR', ARRAY['CONSUMIDOR']::ROL[]) RETURNING id_usuario INTO id_consumidor;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular) 
        VALUES (id_consumidor, 'María', 'Compradora', 'maria.cliente@email.com', 'consumidor' ,'+59899555666');
    INSERT INTO consumidores (id_consumidor) VALUES (id_consumidor);
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_consumidor, crypt('Contraseña', gen_salt('bf', 10)));


    -- Alta de ambos
    INSERT INTO usuarios (rol_actual, roles) VALUES ('CONSUMIDOR', ARRAY['CONSUMIDOR']::ROL[]) RETURNING id_usuario INTO id_ambos;
    INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username, celular) 
        VALUES (id_ambos, 'Juan', 'Ambos', 'ambos@email.com', 'ambos' ,'+59899555777');
    INSERT INTO consumidores (id_consumidor) VALUES (id_ambos);
    INSERT INTO productores (id_productor, presentacion) VALUES (id_ambos, 'Productor artesanal de cosas.');
    INSERT INTO credenciales (id_usuario, password_hash) VALUES (id_ambos, crypt('Contraseña', gen_salt('bf', 10)));

    RAISE NOTICE 'Usuarios fecha_creacion: Admin (%), Productor (%), Consumidor (%)', id_administrador, id_productor, id_consumidor;
END $$;