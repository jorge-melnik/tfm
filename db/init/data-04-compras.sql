DO $$
DECLARE
    -- Usuarios
    v_id_productor UUID;
    v_id_ambos UUID;
    v_id_consumidor UUID;
    v_id_superadmin UUID;

    -- Colecciones
    v_compradores UUID[];
    v_vendedores_disponibles UUID[];
    
    -- Variables de control y referencias
    v_comprador UUID;
    v_vendedor UUID;
    v_id_compra INTEGER;
    v_id_pedido INTEGER;
    v_total_compra DECIMAL(12, 2);
    
    v_cant_vendedores INT;
    v_cant_items INT;
    v_estado_pago ESTADO_PAGO;
    
    idx_c INT;
    compra_num INT;
    vend_num INT;
    item_num INT;

    -- Record para iterar sobre productos aleatorios
    r_prod RECORD;
BEGIN
    -- 1. Recuperar UUIDs de usuarios
    SELECT id_usuario INTO v_id_productor FROM datos_personales WHERE username = 'productor';
    SELECT id_usuario INTO v_id_ambos FROM datos_personales WHERE username = 'ambos';
    SELECT id_usuario INTO v_id_consumidor FROM datos_personales WHERE username = 'consumidor';
    SELECT id_usuario INTO v_id_superadmin FROM datos_personales WHERE username = 'superadmin';

    -- Arreglo de compradores objetivo (4 compras cada uno)
    v_compradores := ARRAY[v_id_consumidor, v_id_ambos, v_id_superadmin];

    -----------------------------------------------------------------------------------------
    -- GENERACIÓN DE COMPRAS CON PEDIDOS MULTI-PRODUCTO
    -----------------------------------------------------------------------------------------
    FOR idx_c IN 1..array_length(v_compradores, 1) LOOP
        v_comprador := v_compradores[idx_c];

        FOR compra_num IN 1..4 LOOP
            v_total_compra := 0;

            -- 2. Crear Compra Cabecera
            INSERT INTO compras (id_consumidor, direccion_envio, contacto_receptor, fecha_creacion)
            VALUES (
                v_comprador, 
                'Dirección de entrega C' || idx_c || '-N' || compra_num || ', Zona Centro', 
                '+598 99 ' || floor(random() * 899999 + 100000)::text,
                CURRENT_TIMESTAMP - ((idx_c * 3 + compra_num) || ' days')::INTERVAL + (random() * INTERVAL '180 minutes')
            )
            RETURNING id_compra INTO v_id_compra;

            -- Excluir al comprador para evitar autocompras
            SELECT ARRAY_AGG(id_usuario) INTO v_vendedores_disponibles
            FROM (
                SELECT unnest(ARRAY[v_id_productor, v_id_ambos, v_id_superadmin]) AS id_usuario
            ) u
            WHERE id_usuario <> v_comprador;

            v_cant_vendedores := LEAST(floor(random() * 2 + 2)::int, array_length(v_vendedores_disponibles, 1));

            ---------------------------------------------------------------------------------
            -- CREAR PEDIDOS
            ---------------------------------------------------------------------------------
            FOR vend_num IN 1..v_cant_vendedores LOOP
                v_vendedor := v_vendedores_disponibles[vend_num];

                -- Crear Pedido
                INSERT INTO pedidos (id_productor, id_compra, fecha_creacion)
                VALUES (
                    v_vendedor, 
                    v_id_compra,
                    CURRENT_TIMESTAMP - ((idx_c * 3 + compra_num) || ' days')::INTERVAL + (random() * INTERVAL '180 minutes')
                )
                RETURNING id_pedido INTO v_id_pedido;

                -- Definir entre 1 y 3 productos distintos por cada pedido
                v_cant_items := floor(random() * 3 + 1)::int;

                -----------------------------------------------------------------------------
                -- INSERTAR MÚLTIPLES PRODUCTOS POR PEDIDO
                -----------------------------------------------------------------------------
                FOR r_prod IN 
                    SELECT id_producto, precio 
                    FROM productos 
                    WHERE id_productor = v_vendedor 
                    ORDER BY random() 
                    LIMIT v_cant_items
                LOOP
                    DECLARE
                        v_cantidad INT := floor(random() * 3 + 1)::int;
                    BEGIN
                        INSERT INTO pedido_productos (id_pedido, id_productor, id_producto, cantidad, precio_unitario)
                        VALUES (v_id_pedido, v_vendedor, r_prod.id_producto, v_cantidad, r_prod.precio);

                        v_total_compra := v_total_compra + (v_cantidad * r_prod.precio);
                    END;
                END LOOP;

            END LOOP;

            ---------------------------------------------------------------------------------
            -- REGISTRAR PAGO
            ---------------------------------------------------------------------------------
            IF compra_num = 1 THEN
                v_estado_pago := 'APROBADO';
            ELSE
                v_estado_pago := 'PENDIENTE';
            END IF;

            INSERT INTO pagos (id_compra, id_externo, metodo_pago, estado_pago, respuesta_raw, fecha_creacion)
            VALUES (
                v_id_compra,
                'TRX-' || v_id_compra || '-' || floor(random() * 899999 + 100000)::text,
                'TRANSFERENCIA',
                v_estado_pago,
                jsonb_build_object(
                    'comprobante_nro', floor(random() * 899999 + 100000)::text,
                    'banco_origen', 'BROU',
                    'monto_total', v_total_compra,
                    'estado', v_estado_pago
                ),
                CURRENT_TIMESTAMP - ((idx_c * 3 + compra_num) || ' days')::INTERVAL + INTERVAL '10 minutes'
            );

        END LOOP;
    END LOOP;
END $$;