# Crear infra de desarrollo

- Obtener AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY de la consola web de aws, IAS.
- Instalar aws cli
- Instalar terraform cli
- aws configure y completar los datos solicitados, región , AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
  Debemos instalar terrafom, el aws cli y configurar las credenciales.

## Aplicar cambios con terraform

terraform validate
terraform plan -var-file="desa.tfvars"
terraform apply -var-file="desa.tfvars"

## Comandos para imágenes de prueba

Los siguientes comandos funcionan para el bucket actual usado en el desarrollo del tfm. Si es otro, corregir los valores.

- Sincronizar imágenes de etiquetas estando en carpeta anterior a etiquetas local
  aws s3 sync etiquetas/ s3://deaca-storage-development/etiquetas/ --delete

- Sincronizar imágenes de productos estando en carpeta anterior a productos local
  aws s3 sync productos/ s3://deaca-storage-development/productos/ --delete

- Sincronizar imágenes de usuarios estando en carpeta anterior a usuarios local
  aws s3 sync usuarios/ s3://deaca-storage-development/usuarios/ --delete

- Invalidar cache imagenes:
  aws cloudfront create-invalidation --distribution-id EOZMEA10LN4QP --paths "/etiquetas/_"
  aws cloudfront create-invalidation --distribution-id EOZMEA10LN4QP --paths "/productos/_"
