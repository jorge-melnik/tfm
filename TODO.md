- .env.example
  email_verified: true
- row level security?
- migraciones?
- F**Must have**n todos los datos de las interfaces

Preguntas.

- Stock del producto publicado. Si bien podemos ir restando automáticamente,
  como se suma? A mano cambiando el stock?
  Se desea contar con el registro de "movimientos" en el stock del producto?
  Se ingresa/modifica el stock a Manopla.

Que sería tiempo de entrega? Iríadentro de la descripción.

Como le llamamos? Pedido? Venta? Compra?: Mis Ventas para productor y Mis compras para consumidor.

Como le llamamos? Producto? Publicación?: Producto nomás.

Que estados se te ocurren para los pedidos/compras/ventas? Pagando, Pagado, listo para entrega, entregado y cancelado.

Stock Por ubicación? Producto/publicación asociada a uno a varias ubicaciones?

- Stock es único de cada producto/productor. Productor tiene una única ubicación.
- Consumidor si podría tener varias ubicaciones.

Definimos "zonas" de entrega asociadas a la ubicación? O al productor?

- Zona de entrega asociada al productor.

Estas zonas de entrega serían las localidades? O polígonos?

- Elegir entre Todo uruguay, o lista localidades (por defecto aparece su departamento y localidad seleccionada)

Definimos un mínimo de compra para envío (cuando se acepta envío) ?

- No hay minimo de compra ni costo de envío.

Que tiempo tiene el usuario para que se confirme el pago en el sistema?

- El carrito vive en la bd. Cuando se confirma el pago se vacía el carrito y se crea el pedido.
- Si el pago es síncrono no se necesita estado Pagando. Pero mejor considerarlo por si se agrega plataforma no sincrona.

-- Que una IA pueda consumir directamente la api ?


-- Usuario no admin para la base de datos? La api NUNCA necesita hacer CREATE o DROP
-- Row level security ?
-- TODO: fijarse que tablas amerita pasar a un esquema privado con la siguiente estrategia de permisos.

-- Considerar WHERE to_tsvector(contenido) @@ to_tsquery('perro')  si hay que hacer búsqueda en textos completos. full-text search

-- TODO: En subcategorías, que se puedan seleccionar las etiquetas permitidas.



- Carrito
- Documentación. Leer plantilla y documentar al menos lo hecho hasta ahora.
- BORRADOR: Objetivos, Introducción y contexto y algún resultado preliminar.
- Hacer borrador y pasarle al profe.
- Se puede ir metiendo el gant, hdus, etc.

- Para poder hacer carrito primero implementar:
- Autenticación.
- Autorización.


DOCUMENTACIÓN:
- 1 release para cada entrega.
- la última release que sea un mvp.
- Prioridades - > Moscow. ¿Qué funcionalidades son imprescindibles para el éxito del proyecto?   
https://www.itdo.com/blog/moscow-que-es-y-como-priorizar-en-el-desarrollo-de-tu-aplicacion/
  - Must have (Debe tener)  
  - Should have (Debería incluir)  
  - Could have (Podría incluir)
  - Won’t have (No se van a hacer)
- Estimación -> T-Shirt

Milestones:
- Tema: No se asigna
- Epica: Solo si van todas las historias pendientes a esa release.
- Historia: Si asignar.
- Tarea: Si asignar. 

Historias: 
**Como** consumidor
**quiero** registrarme en el sistema 
**para** comprar productos disponibles.  

### ✅ Validación
- [ ] El usuario puede acceder a un formulario que solicita los datos requeridos para el registro.
- [ ] El sistema valida los datos ingresados.



**Como** productor
**quiero** registrarme en el sistema  
**para** poder ofrecer y vender mis productos  

### ✅ Criterios de aceptación
- [ ] El usuario puede acceder a un formulario que solicita los datos necesarios para el registro  
- [ ] El sistema valida los datos ingresados  
- [ ] El email debe ser único  
- [ ] El usuario puede indicar si acepta envíos y/o retiros  
- [ ] El usuario puede ingresar una presentación como productor  
- [ ] El sistema crea correctamente la cuenta con perfil productor si los datos son válidos  
- [ ] El sistema informa el resultado del registro (éxito o error)  