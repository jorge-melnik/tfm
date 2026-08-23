# Especificación de requerimientos Funcionales

## Gestión de usuarios (GU)

| Identificador | Enunciado | Prioridad |
| :--- | :--- | :--- |
| **RF-GU-01** | El sistema debe permitir al usuario consumidor registrarse con nombre de usuario, nombres, apellidos, contraseña, email, celular y foto. | **Must have** |
| **RF-GU-02** | El sistema debe permitir al usuario productor registrarse ingresando nombre de usuario, nombres, apellidos, contraseña, email, celular, si acepta envios y/o retiros, foto y presentacion. | **Must have** |
| **RF-GU-03** | El sistema debe permitir al usuario el registro con Google. | **Could have** |
| **RF-GU-04** | El sistema debe permitir al usuario el registro con Facebook. | **Won't have** |
| **RF-GU-05** | El sistema debe permitir al usuario iniciar sesión con Google y el email previamente registrado. | **Could have** |
| **RF-GU-06** | El sistema debe permitir al usuario iniciar sesión con Facebook y el email previamente registrado. | **Could have** |
| **RF-GU-07** | El sistema debe permitir al usuario iniciar sesión con nombre de usuario y contraseña. | **Must have** |
| **RF-GU-08** | El sistema debe permitir al usuario iniciar sesión con email y contraseña. | **Must have** |
| **RF-GU-09** | El sistema debe permitir al usuario proveedor gestionar sus datos personales nombres, apellidos, email, celular, si acepta envios y/o retiros, foto, acepta envíos y/o retiros y presentacion. | **Must have** |
| **RF-GU-10** | El sistema debe permitir al usuario consumidor gestionar su datos personales ingresando nombre de usuario, nombres, apellidos, contraseña, email, celular y foto. | **Must have** |
| **RF-GU-11** | El sistema debe permitir al usuario consumidor activar las funcionalidades de productor ingresando si acepta envíos y/o retiros y presentación. | **Must have** |
| **RF-GU-12** | El sistema debe permitir al usuario registrado activar las funcionalidades de consumidor. | **Must have** |
| **RF-GU-13** | El sistema debe permitir al usuario gestionar sus ubicaciones ingresando nombre, departamento, localidad, dirección, comentarios y el punto en un mapa. | **Should have** |
| **RF-GU-14** | El sistema debe permitir al usuario gestionar las notificaciones que desea recibir por email seleccionando entre "Me realizaron un pedido", "Me realizaron una pregunta", "Me contestaron una pregunta", "Mi pedido se ingresó correctamente", "Pedido listo para entrega", "Mi pedido está en camino", "Pedido ya retirado o recibido". | **Could have** |
| **RF-GU-15** | El sistema debe permitir al usuario gestionar las notificaciones que desea en la propia app seleccionando entre "Me realizaron un pedido", "Me realizaron una pregunta", "Me contestaron una pregunta", "Mi pedido se ingresó correctamente", "Pedido listo para entrega", "Mi pedido está en camino", "Pedido ya retirado o recibido". | **Could have** |
| **RF-GU-16** | El sistema debe permitir al usuario alternar su interfaz entre los modos disponibles (administrador, consumidor, productor). | **Must have** |
| **RF-GU-17** | El sistema debe recordar el rol usado por el usuario en su última sesión (Productor, Consumidor, Admin). | **Must have** |
| **RF-GU-18** | El sistema debe permitir al usuario verificar su email. | **Could have** |
| **RF-GU-19** | El sistema debe permitir al usuario verificar su celular. | **Could have** |
| **RF-GU-20** | El sistema debe permitir al usuario darse de baja del sistema borrando todos sus datos personales en cumplimiento de la ley 18331 de Uruguay. | **Should have** |
| **RF-GU-21** | El sistema debe permitir al usuario descargarse toda la información relacionada a su usuario en formato xlsx y ods. | **Could have** |
| **RF-GU-22** | El sistema debe permitir al usuario recuperar su contraseña. | **Must have** |
| **RF-GU-23** | El sistema no debe permitir al usuario cambiar su nombre de usuario. | **Must have** |


## Panel del productor (PP)

| Identificador | Enunciado | Prioridad |
| :--- | :--- | :--- |
| **RF-PP-01** | El sistema debe permitir al usuario gestionar su catálogo de productos con nombre del producto, descripcion, precio, cantidad disponible y entre 1 y 5 fotos del producto, un video opcional ubicación de producción. | **Must have** |
| **RN-PP-01** | El sistema no debe permitir que se borre un producto que ya fue comprado. | **Must have** |
| **RF-PP-02** | El sistema debe gestionar el stock de los productos para cada venta en proceso de pago. (Descuenta stock, si se confirma el pago listo, sino se vuelve a sumar el stock). | **Must have** |
| **RF-PP-03** | El sistema debe permitir al productor gestionar los pedidos recibidos. | **Must have** |
| **RF-PP-04** | El sistema debe proporcionar al productor un mecanismo para ver el historial de pedidos recibidos mostrando estado, pago (datos del pago). | **Should have** |
| **RF-PP-05** | El sistema debe permitir al productor gestionar los chats recibidos. | **Should have** |
| **RF-PP-06** | El sistema debe permitir al productor que realiza envíos, indicar los días y horarios en que realiza envíos. | **Should have** |
| **RF-PP-07** | El sistema debe permitir al productor que entrega en su ubicación indicar los días y horarios de entrega habilitados para cada ubicación. | **Should have** |
| **RF-PP-08** | El sistema debe permitir al productor contestar las preguntas recibidas. | **Must have** |
| **RF-PP-09** | El sistema debe permitir al productor reportar una pregunta que no cumple los términos y condiciones. | **Could have** |
| **RF-PP-10** | El sistema debe calcular la calificación del productor tomando el promedio de calificaciones de todos sus pedidos recibidos. | **Could have** |
| **RF-PP-11** | El sistema debe permitir al productor ver su calificación y el comentario recibido en sus pedidos. | **Could have** |
| **RF-PP-12** | El sistema debe permitir al productor ver los comentarios recibidos en sus productos. | **Could have** |
| **RF-PP-13** | El sistema debe calcular la calificación de los productos del productor tomando el promedio de calificaciones recibidas en el producto. | **Could have** |
| **RF-PP-14** | El sistema debe permitir al productor ver la calificación de sus productos. | **Could have** |
| **RF-PP-15** | El sistema debe proporcionar al productor un mecanismo para visualizar las ventas de sus productos. | **Must have** |
| **RF-PP-16** | El sistema debe calcular la cantidad vendida el último mes para cada producto del productor. | **Could have** |
| **RF-PP-17** | El sistema debe calcular la cantidad vendida los últimos 6 meses para cada producto del productor. | **Could have** |
| **RF-PP-18** | El sistema debe permitir al productor ordenar su catálogo por cantidad vendida en un período seleccionado. | **Could have** |
| **RF-PP-19** | El sistema debe mostrar en el catálogo de productos la cantidad vendida los últimos 12 meses (último año) para cada producto del productor. | **Could have** |
| **RF-PP-20** | El sistema debe permitir ordenar el catálogo por cantidad vendida. | **Could have** |
| **RF-PP-21** | El sistema debe mostrar una gráfica de evolución de las ventas el último año en pesos, mes a mes, incluyendo el total. | **Could have** |
| **RF-PP-22** | El sistema debe mostrar una gráfica de cantidades vendidas de cada producto del productor. | **Could have** |

## Panel del consumidor

| Identificador | Enunciado | Prioridad |
| :--- | :--- | :--- |
| **RF-PC-01** | El sistema debe permitir al consumidor ver todos los productos disponibles. | **Must have** |
| **RF-PC-02** | El sistema debe permitir al consumidor filtrar los productos en base a categorías, subcategorías, etiquetas, favoritos, cercanía y sus ubicaciones. | **Must have** |
| **RF-PC-03** | El sistema debe permitir al consumidor buscar productos por su nombre. | **Must have** |
| **RF-PC-04** | El sistema debe permitir al consumidor gestionar su carrito de compras. | **Must have** |
| **RF-PC-05** | El sistema debe permitir al consumidor finalizar una compra con los productos del carrito seleccionando envío o retiro y medio de pago. | **Must have** |
| **RF-PC-06** | El sistema debe permitir al consumidor visualizar nombre de usuario, presentacion, foto, calificación del productor y pedidos realizados a dicho productor. | **Should have** |
| **RF-PC-07** | El sistema debe proporcionar al consumidor un mecanismo para consultar el historial de compras. | **Must have** |
| **RF-PC-08** | El sistema debe permitir al consumidor contactar al productor de una compra finalizada **Should have**nte un chat. | **Should have** |
| **RN-PC-09** | El sistema NO debe permitir que se finalice una compra con envío al domicilio del usuario, sin que el usuario tengo una ubicación asociada. | **Must have** |
| **RF-PC-10** | El sistema debe permitir al usuario consumidor realizar preguntas en los productos. | **Must have** |
| **RF-PC-11** | El sistema debe permitir al usuario consumidor calificar los productos comprados en una escala del 1 al 5 y dejar un comentario. | **Could have** |
| **RF-PC-12** | El sistema debe permitir al usuario consumidor ver las calificaciones y comentarios que recibió un producto. | **Could have** |
| **RF-PC-13** | El sistema debe proporcionar al usuario consumidor una interfaz con nombre, ubicación, entrega/retiro, horarios de entrega/retiro para ver los datos del productor. | **Could have** |
| **RF-PC-14** | El sistema debe proporcionar al usuario consumidor una interfaz para realizar el seguimiento de su pedido, mostrando fecha del pedido, producto, ubicación, entrega/retiro. | **Must have** |
| **RF-PC-15** | El sistema debe permitir al consumidor marcar productos o productores como favoritos para acceso rápido. | **Could have** |
| **RF-PC-16** | El sistema debe permitir al consumidor calificar los productos que alguna vez compró. | **Could have** |
| **RF-PC-17** | El sistema debe permitir al consumidor cambiar la calificación dada a los productos que alguna vez compró. | **Could have** |
| **RF-PC-18** | El sistema debe permitir al consumidor dejar un comentario del producto cada vez que recibe un pedido con dicho producto. | **Could have** |
| **RF-PC-19** | El sistema debe permitir al consumidor calificar y comentar los pedidos recibidos por única vez. | **Could have** |

## Panel del administrador.

| Identificador | Enunciado | Prioridad |
| :--- | :--- | :--- |
| **RF-PA-01** | El sistema debe permitir al usuario administrador gestionar las etiquetas. | **Should have** |
| **RF-PA-02** | El sistema debe permitir al usuario administrador gestionar las categorías ingresando nombre de la categoría. | **Should have** |
| **RF-PA-03** | El sistema debe permitir al usuario administrador gestionar las subcategorías, ingresando nombre de la subcategoría, categoría a la que pertenece y etiquetas válidas en dicha subcategoría. | Al**Should have**ta |
| **RF-PA-04** | El sistema debe permitir al usuario administrador un mecanismo para ver los usuarios registrados mostrando usuario, rol, cantidad preguntas reportadas y confirmadas, etc. | **Could have** |
| **RF-PA-05** | El sistema debe permitir al usuario administrador gestionar las preguntas reportadas como incumpliendo los terminos. | **Could have** |
| **RF-PA-06** | El sistema debe permitir al usuario administrador bloquear a un usuario. | **Could have** |


# Especificacion de requerimientos no funcionales

| Identificador | Enunciado | Prioridad |
| :--- | :--- | :--- |
| **RNF-01** | **Cumplimiento Legal (Protección de Datos):** El sistema debe garantizar la protección de datos personales en estricto cumplimiento con la Ley N° 18.331 de Uruguay, implementando medidas de seguridad técnica y organizativa para asegurar la confidencialidad, integridad y disponibilidad de la información, permitiendo además el ejercicio de los derechos ARCO (Acceso, Rectificación, Cancelación y Oposición). | **Must have** |
| **RNF-02** | **Optimización para Motores de Búsqueda (SEO):** El sistema debe estar optimizado para indexación en buscadores, implementando el uso de URLs amigables, etiquetas meta (title, description) dinámicas basadas en el catálogo de productos, carga eficiente de recursos (Web Vitals) y una estructura de encabezados lógica para mejorar el posicionamiento orgánico. | **Should have** |
| **RNF-03** | **Seguridad de la Aplicación (OWASP ASVS):** El sistema debe debe garantizar el cumplimiento total de todos los controles del **Nivel 1 OWASP ASVS 5.0** (defensa básica contra vulnerabilidades comunes) que aplican. | **Must have** |
| **RNF-04** | **Seguridad de la Aplicación (OWASP ASVS):** El sistema debe garantizar el cumplimiento total de todos los controles del **Nivel 2** (defensa contra amenazas avanzadas) para los módulos críticos de manejo de pagos y datos sensibles. | **Must have** |



Si el productor marca el pedido en camino, se podría compartir la ubicación en tiempo real.
, tiempo de entrega capaz es asociado a la publicación.

F**Must have** especificar el tema de pagos. Bamboo payments o Stripe?

ver donde mostrar un mapa

- Acordarse que un usuario compra a varios productores. Compra tiene varios pedidos
- Calificación del producto. Solo califica el producto una única vez (se puede modificar) por usuario.

- cancelar venta. y la plata?
- INFORMAR un problema

