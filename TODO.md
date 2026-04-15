- .env.example
  email_verified: true
- row level security?
- migraciones?
- Faltan todos los datos de las interfaces

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
