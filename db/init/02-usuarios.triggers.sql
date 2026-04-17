
CREATE OR REPLACE FUNCTION fn_sincronizar_roles()
RETURNS TRIGGER AS $$
DECLARE
    v_rol ROL;
BEGIN
    -- Determinar qué rol estamos manejando según la tabla que disparó el trigger
    IF TG_TABLE_NAME = 'productores' THEN
        v_rol := 'PRODUCTOR';
    ELSIF TG_TABLE_NAME = 'consumidores' THEN
        v_rol := 'CONSUMIDOR';
    END IF;

    IF (TG_OP = 'DELETE' OR NEW.activo = FALSE) THEN    --delete fisico o lógico
        UPDATE usuarios 
        SET roles = array_remove(roles, v_rol)
        WHERE id_usuario = OLD.id_usuario;
    ELSE -- Si entra acá, NEW.activo = TRUE
        UPDATE usuarios 
        SET roles = array_append(array_remove(roles, v_rol), v_rol) -- Hacemos un remove antes por si las moscas
        WHERE id_usuario = NEW.id_usuario;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- TODO: TRIGGERs para productores
CREATE OR REPLACE TRIGGER tr_sync_productores_lifecycle
AFTER INSERT OR DELETE ON productores
FOR EACH ROW 
EXECUTE FUNCTION fn_sincronizar_roles();

CREATE OR REPLACE TRIGGER tr_sync_productores_update
AFTER UPDATE OF activo ON productores
FOR EACH ROW 
WHEN (OLD.activo IS DISTINCT FROM NEW.activo)
EXECUTE FUNCTION fn_sincronizar_roles();

-- TODO: TRIGGERs para consumidores
CREATE OR REPLACE TRIGGER tr_sync_consumidores_lifecycle
AFTER INSERT OR DELETE ON consumidores
FOR EACH ROW 
EXECUTE FUNCTION fn_sincronizar_roles();

CREATE OR REPLACE TRIGGER tr_sync_consumidores_update
AFTER UPDATE OF activo ON consumidores
FOR EACH ROW 
WHEN (OLD.activo IS DISTINCT FROM NEW.activo)
EXECUTE FUNCTION fn_sincronizar_roles();