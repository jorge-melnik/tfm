# Especificación de requerimientos

## Gestión de usuarios y perfiles (GUP)

- RF-GUP-01: El sistema debe permitir al usuario consumidor registrarse con nombre de usuario, nombres, apellidos y ubicación (opcional), contraseña, email, celular y foto.
- RF-GUP-02: El sistema debe permitir al usuario productor registrarse ingresando nombre de usuario, nombres, apellidos, ubicación, contraseña, email, celular, coordenadas, si acepta envios y/o retiros tiempo de entrega, foto y presentacion.
- RF-GUP-03: El sistema debe permitir al usuario el registro con Google.
- RF-GUP-04: El sistema debe permitir al usuario el registro con Facebook.
- RF-GUP-05: El sistema debe permitir al usuario iniciar sesión con Google y el email previamente registrado.
- RF-GUP-06: El sistema debe permitir al usuario iniciar sesión con Facebook y el email previamente registrado.
- RF-GUP-07: El sistema debe permitir al usuario iniciar sesión con nombre de usuario o email, y su contraseña.
- RF-GUP-08: El proveedor podrá gestionar sus perfil con nombres, apellidos, ubicación, contraseña, email, celular, ubicación, foto y presentacion.
- RF-GUP-09: El consumidor podrá gestionar sus perfil con nombres, apellidos, contraseña, email, celular, ubicación, foto y presentacion.
- RF-GUP-10: El sistema debe permitir al usuario consumidor activar las funcionalidades de productor ingresando tiempo de entrega, si acepta envíos y/o retiros, coordenadas y presentación.
- RF-GUP-11: El sistema debe permitir al usuario productor activar las funcionalidades de consumidor.
- RF-GUP-12: El sistema debe permitir al usuairo gestionar sus ubicaciones ingresando nombre, departamento, localidad, dirección y comentarios.
- RF-GUP-13: El sistema debe permitir al usuario gestionar las notificaciones que desea recibir.

## Panel del productor (PP)

- RF-PP-01: El sistema debe permitir al usuario gestionar su catálogo de productos ingresando nombre del producto, presentacion, precio, cantidad disponible y entre 1 y 5 fotos del producto y un video opcional.
- RF-PP-02: El sistema debe gestionar el stock del producto para cada venta realizada.
- RF-PP-03: El sistema debe gestionar el stock de los productos para cada venta en proceso de pago. (Descuenta stock, si se confirma el pago listo, sino se vuelve a sumar el stock).
- RF-PP-04: El sistema debe permitir al productor gestionar los pedidos recibidos.
- RF-PP-05: El sistema debe proporcionar al productor un mecanismo para ver el historial de ventas.
- RF-PP-06: El sistema debe proporcionar al productor un mecanismo para ver el historial de pagos recibidos.
- RF-PP-07: El sistema debe permitir al productor gestionar los chats recibidos.
- RF-PP-08: El sistema debe permitir al productor que realiza envíos, indicar los días en que realiza envíos.
- RF-PP-09: El sistema debe permitir al productor que entrega en su ubicación indicar los días y horarios de entrega habilitados para cada ubicación.
- RF-PP-09: El sistema debe permitir al productor contestar las preguntas recibidas.
- RF-PP-10: El sistema debe calcular la calificación del productor tomando el promedio de calificaciones de todos sus productos.

## Panel del consumidor

- RF-PC-01: El sistema debe permitir al consumidor explorar productos en base a categorías, subcategorías, etiquetas, su direcciones y ubicación actual.
- RF-PC-02: El sistema debe permitir al consumidor gestionar su carrito de compras.
- RF-PC-03: El sistema debe permitir al consumidor finalizar una compra con los productos del carrito seleccionando envío o retiro y medio de pago.
- RF-PC-04: El sistema debe permitir al consumidor visualizar nombre de usuario, presentacion, foto y calificación del productor.
- RF-PC-05: El sistema debe proporcionar al consumidor un mecanismo para consultar el historial de compras.
- RF-PC-06: El sistema debe permitir al consumidor contactar al productor de una compra finalizada mediante un chat.
- RF-GUP-07: El sistema NO debe permitir que se finalice una compra si el usuario con envío al domicilio del usuario sin que el usuario tengo una ubicación asociada.
- RF-GUP-08: El sistema debe permitir al usuario consumidor realizar preguntas en los productos.
- RF-GUP-09: El sistema debe permitir al usuario consumidor durante los 5 días posteriores de confirmada la compra calificar el producto en una escala del 1 al 5 y dejar un comentario.
- RF-GUP-10: El sistema debe permitir al usuario consumidor ver las calificaciones y comentarios que recibió un producto.

## Panel del administrador.

- RF-PA-01: El sistema debe permitir al usuario administrador gestionar las etiquetas.
- RF-PA-02: El sistema debe permitir al usuario administrador gestionar las categorías ingresando nombre de la categoría y subcategorías asociadas.
- RF-PA-03: El sistema debe permitir al usuario administrador gestionar las subcategorías, ingresando nombre de la subcategoría, categoría a la que pertenece y etiquetas válidas en dicha subcategoría.
