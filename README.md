# tfm

- Tecnologías libres.
- Dockerizar
- Responsiva
- Desplegar en AWS.
- Información del proveedor (mapa?)
- Llevar a google maps?
- Videos del proveedor explicando lo que hace.

- Hablar por la propia aplicación con el proveedor/cliente.
- Historial de compras.
- Historial de ventas
- Clientes que me han consultado.
- Subir productos.
- Panel de administración.
- Zoneless
- SSR (seo para web)
- PWA
- Capacitor para app nativa con webview (no importa el ceo)
- Web Push y PushNotification nativas según corresponda. provide: NotificationService, useClass: Capacitor.isNativePlatform() ? NativePushService : WebPushService Inyección de Dependencia (D de SOLID)
- Tanto en web, pwd y nativa van a funcionar las notificaciones
- withComponent Input binding
- Validadores compatibles con FormsModule y ReactiveFormsModule. Funcion pura + directiva (forms module) seguramente sean compatibles con signals forms.
- Tema claro y oscuro
- Componentes con primeng
- Checklist de OWASP
- Refresh token rotation
- CapacitorHttp para versión nativa.
- Cors: https prod, https desa, capacitor://localhost para ios y http://localhost para android
- Login: user y pass, red social. 3 formas distintas para user y pass, red social web y red social nativo. En red social no siempre hay email. Strategy pattern?
- Pagos: PagosWeb o bamboopayments. "stripe"
- CDN para imágenes. (upload desde angular?)
- Concurrencia al comprar últimos productos del stock.
- Devops para generar todos los builds.
- Websockets para actualizar listado de productos, stock y mensajes

- Escribir la semana del 14.

- La primera vez que entra a "vender" completa datos adicionales.
- Al consumidor se le exige la dirección antes de confirmar la primera compra.
- Tiempo de entrega (demora,o espera).
- Productor se hace cargo del envío o consumidor se hace cargo del envío. Al menos una.
- Preguntar cosas en el producto. Se ve fecha y pregunta. No importa quien. Solo contesta el productor.
- Solo se ven los datos básicos del productor. username, descripción, foto,
- Iniciar sesión con email o username
- Contacto a proveedor es un chat asociado al productor (y consumidor)
- Que la dirección contenga departamento y localidad. Coordenada solo si hay compra confirmada y quiere recibirla.
- Video opcional para el producto.
- Reviews y valoraciones.
- Cesta que incluya distintos proveedores
- Suscripción a notificaciones. Pregunta, pedido enviado, etc. Gestionar eso.
- Considerar direcciones en plural si no complica.
- Gestión de etiquetas (agroecológico, en transición, local artesanal). Definir para que categorías son válidas.
- Gestión de categorías y subcategorías:
  Verduras, frutas, huevos, miel, lácteos artesanales: Alimentos frescos
  • Plantines, hierbas medicinales, semillas criollas: Plantas y semillas
  • Conservas, fermentados, jabones naturales, tinturas: Productos elaborados
  • Bambú, mimbre, cerámica, madera: Artesanías de materiales naturales
  • Compost, lombricultura, insumos agroecológicos: Otros productos regenerativos
- Busquedas con filtros y esas cosas.
- La primera vez que quieras vender se activa el perfil vendedor para siempre.
- Productor que marque que días envía (si realiza envíos). O que días (y horario) se puede pasar a levantar.
- Para departamentos, direcciones y localidades, usar ideuy?

-- Podemos usar CITEXT cuando son textos UNIQUE

Reunión 15/4:
Clasificar los requerimientos según prioridad.
Alta Indispensables para el MVP
Media Deseables para el MVP
Baja Puede quedar para más adelante.

Redactar los requisitos no funcionales.

Considerar validar el productor. ¿Para que tenga un tick?

Dejar pagos para último. Considerar simular el pago.

Revisar calificaciones (clasificar prioridad baja igual):

- Evaluar producto. Unica evaluación que puede cambiar. Esta así.
- Evaluar proveedor al q le compre alguna vez. Única evaluación que puede cambiar. ¿mejor que evaluar pedido y promediar?
- ¿Evaluar consumidor?

- Falta ver pedidos realizados a un productor (siendo consumidor) cuando ve la info del productor
- No olvidarse del checklist de OWASP
