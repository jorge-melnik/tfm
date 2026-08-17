CREATE TABLE IF NOT EXISTS etiquetas (
    id_etiqueta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre CITEXT NOT NULL UNIQUE CHECK (
        char_length(nombre) BETWEEN 3 AND 35
    ),
    etiqueta CITEXT NOT NULL UNIQUE CHECK (
        char_length(etiqueta) BETWEEN 3 AND 35
        AND etiqueta ~ '^[a-zA-Z0-9-]+$' 
    ),
    imagen TEXT, --FIXME: Podría ser clase icono o url de imagen. --FIXME: Hacer not null  usar el id o slug para persistir la imagen?
    color VARCHAR(7) NOT NULL DEFAULT '#6366F1' -- Color hexadecimal FIME: Sacar el default. Creo que no va a ser necesario color, porque ya la imagen tiene todo lo necesario.
);

CREATE TABLE IF NOT EXISTS subcategoria_etiquetas (
    id_subcategoria INTEGER REFERENCES subcategorias(id_subcategoria) ON DELETE CASCADE ON UPDATE CASCADE,
    id_etiqueta INTEGER REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id_subcategoria, id_etiqueta)
);

-------------------------------------------------------------------
-------- TRIGGER PARA inmutabilidad de etiquetas.etiqueta ---------
-------------------------------------------------------------------
DROP TRIGGER IF EXISTS tg_etiquetas_etiqueta_inmutable ON etiquetas;
CREATE TRIGGER tg_etiquetas_etiqueta_inmutable
BEFORE UPDATE OF etiqueta ON etiquetas
FOR EACH ROW
EXECUTE FUNCTION tr_fn_impedir_cambio_columna('etiqueta');