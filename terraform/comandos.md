- Invalidar cache imagenes:
aws cloudfront create-invalidation --distribution-id EOZMEA10LN4QP --paths "/etiquetas/*"

- Sincronizar imágenes de etiquetas estando en carpeta anterior a etiquetas local
aws s3 sync etiquetas/ s3://deaca-storage-development/etiquetas/ --delete