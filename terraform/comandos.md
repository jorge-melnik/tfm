- Invalidar cache imagenes:
aws cloudfront create-invalidation --distribution-id EOZMEA10LN4QP --paths "/etiquetas/*"
aws cloudfront create-invalidation --distribution-id EOZMEA10LN4QP --paths "/productos/*"

- Sincronizar imágenes de etiquetas estando en carpeta anterior a etiquetas local
aws s3 sync etiquetas/ s3://deaca-storage-development/etiquetas/ --delete

- Sincronizar imágenes de productos estando en carpeta anterior a productos local
aws s3 sync productos/ s3://deaca-storage-development/productos/ --delete