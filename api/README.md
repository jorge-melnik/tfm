# Api De acá!

## Scripts:

- `npm run dev` : Inicia el servidor en modo desarrollo y con hotreload
- `npm run test`: Ejecutar los tests unitarios
- `npm run testc8`: Ejecutar los tests unitarios con reporte armado por c8 (por errores en números de línea.)
- `npm run build`: Generar el build con los archivos .js
- `npm run start`: Ejecutar el servidor a partir de los archivos .js (para uso en producción)

## Tsx

Para ejecutar en desarrollo usamos tsx. Esta librería no necesita transpilar a los .js para

## Responses

- Recuersos que devuelven colecciones que necesitan paginación, usan el esquema ListResponse
- Recuersos que devuelven colecciones que NO necesitan paginación, usan el esquema Type.Array(miTipo). Sin perjuicio de usar ref.
- Recursos que devuelven objeto usan el esquema de los datos.

## Requests

- Recuersos que devuelven colecciones que necesitan paginación deben especificar queryString de forma obligatoria.

## Slugs

- Entidades que tienen un atributo slug_entidad, usarán dicho slug para los GET. Para los demás métodos se seguirá usando el id_entidad.

//TODO: No está paysandú en las localidades?
