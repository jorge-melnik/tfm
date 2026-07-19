# terraform/main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. BUCKET DE S3 PRIVADO
resource "aws_s3_bucket" "storage" {
  bucket = var.bucket_name

  tags = {
    Name        = "${var.environment}-products-storage"
    Environment = var.environment
  }
}

# Bloquear todo el acceso público directo al bucket de S3
resource "aws_s3_bucket_public_access_block" "storage_block" {
  bucket = aws_s3_bucket.storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 2. ORIGIN ACCESS CONTROL (OAC) FOR CLOUDFRONT
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.environment}-s3-oac"
  description                       = "Acceso seguro desde CloudFront al S3 de ${var.environment}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 3. DISTRIBUCIÓN DE CLOUDFRONT (CDN)
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN para las imagenes de productos de ${var.environment}"
  price_class         = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.storage.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.storage.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.storage.id}"

    # Eliminamos las políticas por ID que dieron error y volvemos a forwarded_values optimizado:
    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Environment = var.environment
  }
}

# 4. POLÍTICA DE S3 (Permite que solo TU CloudFront lea el bucket)
resource "aws_s3_bucket_policy" "allow_cloudfront" {
  bucket = aws_s3_bucket.storage.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.storage.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}

# 5. CONFIGURACIÓN DE CORS EN S3 PARA SUBIDAS DESDE EL FRONTEND
resource "aws_s3_bucket_cors_configuration" "storage_cors" {
  bucket = aws_s3_bucket.storage.id

  cors_rule {
    allowed_origins = [var.frontend_domain]
    allowed_methods = ["PUT", "POST", "GET", "HEAD"]
    allowed_headers = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

output "cloudfront_domain" {
  value       = aws_cloudfront_distribution.cdn.domain_name
  description = "Dominio para usar en el frontend para mostrar imágenes."
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.storage.id
  description = "Nombre del bucket creado"
}