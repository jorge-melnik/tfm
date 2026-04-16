# Consideraciones
- Para borrado lógico usar siempre fecha_eliminado y una columna calculada activo
- En general cuando se quiere auditoría o borrado lógico usar:
    - fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    - fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    - fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    - activo BOOLEAN GENERATED ALWAYS AS (fecha_eliminacion IS NULL) STORED

