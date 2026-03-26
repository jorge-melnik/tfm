En features ubicaremos todos los componentes "inteligentes", que agrupan componentes y/o hacen uso de servicios para consumir la api.
Dentro de cada feature a su vos podremos tener:

- components: Componentes que únicamente se utilizan en esta feature.
- pages: Componentes que representan la página cargada mediante una ruta.
- services: servicios exclusivos de esta feature (se puede cargar para toda la ruta o solo para un componente)
- feature.routes.ts: Archivo de rutas para lazy loading
