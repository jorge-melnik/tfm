# terraform/variables.tf

variable "aws_region" {
  type        = string
  description = "Región de AWS donde se desplegarán los recursos"
  default     = "sa-east-1"
}

variable "environment" {
  type        = string
  description = "Nombre del entorno (ej: development, production)"
}

variable "bucket_name" {
  type        = string
  description = "Nombre globalmente único para el bucket de S3"
}

variable "frontend_domain" {
  type        = string
  description = "Dominio oficial del frontend para las reglas de CORS"
}