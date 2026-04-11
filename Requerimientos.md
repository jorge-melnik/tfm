# Especificación de requerimientos

## Gestión de usuarios (GUP)

- RF-GUP-01: El sistema debe permitir al usuario consumidor registrarse con nombre de usuario, nombres, apellidos, contraseña, email, celular y foto.
- RF-GUP-02: El sistema debe permitir al usuario productor registrarse ingresando nombre de usuario, nombres, apellidos, contraseña, email, celular, si acepta envios y/o retiros, foto y presentacion.
- RF-GUP-03: El sistema debe permitir al usuario el registro con Google.
- RF-GUP-04: El sistema debe permitir al usuario el registro con Facebook.
- RF-GUP-05: El sistema debe permitir al usuario iniciar sesión con Google y el email previamente registrado.
- RF-GUP-06: El sistema debe permitir al usuario iniciar sesión con Facebook y el email previamente registrado.
- RF-GUP-07: El sistema debe permitir al usuario iniciar sesión con nombre de usuario o email, y su contraseña.
- RF-GUP-08: El sistema debe permitir al usuario proveedor gestionar sus perfil con nombre de usuario, nombres, apellidos, ubicación, contraseña, email, celular, si acepta envios y/o retiros, foto, presentacion.
- RF-GUP-09: El sistema debe permitir al usuario consumidor gestionar su perfil ingresando nombre de usuario, nombres, apellidos, contraseña, email, celular y foto.
- RF-GUP-10: El sistema debe permitir al usuario consumidor activar las funcionalidades de productor ingresando si acepta envíos y/o retiros y presentación.
- RF-GUP-11: El sistema debe permitir al usuario productor activar las funcionalidades de consumidor.
- RF-GUP-12: El sistema debe permitir al usuario gestionar sus ubicaciones ingresando nombre, departamento, localidad, dirección, comentarios y el punto en un mapa.
- RF-GUP-13: El sistema debe permitir al usuario gestionar las notificaciones que desea recibir seleccionando entre "Me realizaron un pedido", "Me realizaron una pregunta", "Me contestaron una pregunta", "Mi pedido se ingresó correctamente", "Pedido listo para retiro en ubicación del productor", "Mi pedido está en camino", "Pedido ya retirado o recibido".
- RF-GUP-14: El sistema debe permitir al usuario alternar su interfaz entre modo Productor, Consumidor y administrador.
- RF-GUP-15: El sistema debe recordar el rol usado por el usuario en su última sesión (Productor, Consumidor).
- RF-GUP-16: El sistema debe permitir al usuario verificar su email.
- RF-GUP-17: El sistema debe permitir al usuario verificar su celular.
- RF-GUP-18: El sistema debe permitir al usuario darse de baja del sistema borrando todos sus datos
  personales en cumplimiento de la ley 18331 de Uruguay.
- RF-GUP-19: El sistema debe permitir al usuario descargarse toda la información relacionada a su usuario en formato xlsx y ods.
- RF-GUP-20: El sistema debe permitir al usuario recuperar su contraseña.

## Panel del productor (PP)

- RF-PP-01: El sistema debe permitir al usuario gestionar su catálogo de productos ingresando nombre del producto, presentacion, precio, cantidad disponible y entre 1 y 5 fotos del producto, un video opcional ubicación de producción.
- RF-PP-02: El sistema debe gestionar el stock del producto para cada venta realizada.
- RF-PP-03: El sistema debe gestionar el stock de los productos para cada venta en proceso de pago. (Descuenta stock, si se confirma el pago listo, sino se vuelve a sumar el stock).
- RF-PP-04: El sistema debe permitir al productor gestionar los pedidos recibidos.
- RF-PP-05: El sistema debe proporcionar al productor un mecanismo para ver el historial de pedidos recibidos.
- RF-PP-06: El sistema debe proporcionar al productor un mecanismo para ver el historial de pagos recibidos.
- RF-PP-07: El sistema debe proporcionar al productor un mecanismo para ver el historial de pedidos entregados.
- RF-PP-08: El sistema debe permitir al productor gestionar los chats recibidos.
- RF-PP-09: El sistema debe permitir al productor que realiza envíos, indicar los días y horarios en que realiza envíos.
- RF-PP-10: El sistema debe permitir al productor que entrega en su ubicación indicar los días y horarios de entrega habilitados para cada ubicación.
- RF-PP-11: El sistema debe permitir al productor contestar las preguntas recibidas.
- RF-PP-12: El sistema debe permitir al productor reportar una pregunta que no cumple los términos y condiciones.
- RF-PP-13: El sistema debe calcular la calificación del productor tomando el promedio de calificaciones de todos sus productos.
- RF-PP-14: El sistema debe permitir al productor ver su calificación.

## Panel del consumidor

- RF-PC-01: El sistema debe permitir al consumidor filtrar los productos en base a categorías, subcategorías, etiquetas, favoritos, cercanía y sus ubicaciones.
- RF-PC-02: El sistema debe permitir al consumidor buscar productos por su nombre.
- RF-PC-03: El sistema debe permitir al consumidor gestionar su carrito de compras.
- RF-PC-04: El sistema debe permitir al consumidor finalizar una compra con los productos del carrito seleccionando envío o retiro y medio de pago.
- RF-PC-05: El sistema debe permitir al consumidor visualizar nombre de usuario, presentacion, foto y calificación del productor.
- RF-PC-06: El sistema debe proporcionar al consumidor un mecanismo para consultar el historial de compras.
- RF-PC-07: El sistema debe permitir al consumidor contactar al productor de una compra finalizada mediante un chat.
- RF-PC-08: El sistema NO debe permitir que se finalice una compra con envío al domicilio del usuario, sin que el usuario tengo una ubicación asociada.
- RF-PC-09: El sistema debe permitir al usuario consumidor realizar preguntas en los productos.
- RF-PC-10: El sistema debe permitir al usuario consumidor durante los 5 días posteriores de confirmada la compra, calificar el producto en una escala del 1 al 5 y dejar un comentario.
- RF-PC-11: El sistema debe permitir al usuario consumidor ver las calificaciones y comentarios que recibió un producto.
- RF-PC-12: El sistema debe proporcionar al usuario consumidor una interfaz con nombre, ubicación, entrega/retiro, horarios de entrega/retiro.
- RF-PC-13: El sistema debe proporcionar al usuario consumidor una interfaz para realizar el seguimiento de su pedido, mostrando fecha del pedido, producto, ubicación, entrega/retiro.
- RF-PC-14: El sistema debe permitir al consumidor marcar productos o productores como favoritos para acceso rápido.

## Panel del administrador.

- RF-PA-01: El sistema debe permitir al usuario administrador gestionar las etiquetas.
- RF-PA-02: El sistema debe permitir al usuario administrador gestionar las categorías ingresando nombre de la categoría y subcategorías asociadas.
- RF-PA-03: El sistema debe permitir al usuario administrador gestionar las subcategorías, ingresando nombre de la subcategoría, categoría a la que pertenece y etiquetas válidas en dicha subcategoría.
- RF-PA-04: El sistema debe permitir al usuario administrador un mecanismo para ver los usuarios registrados mostrando usuario, rol, cantidad preguntas reportadas y confirmadas, etc.
- RF-PA-04: El sistema debe permitir al usuario administrador gestionar las preguntas reportadas como incumpliendo los terminos.
- RF-PA-04: El sistema debe permitir al usuario administrador bloquear a un usuario.

Si el productor marca el pedido en camino, se podría compartir la ubicación en tiempo real.
, tiempo de entrega capaz es asociado a la publicación.

Falta especificar el tema de pagos.
