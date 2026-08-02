import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import { PresignedUrl, Producto, RequestPresignedUrlSchema } from '@schemas/producto.schema.js';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const productoImagenesRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.put('/', {
    schema: {
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      body: RequestPresignedUrlSchema,
    },
    handler: async (request, reply) => {
      productoRepository.update;
    },
  });
  fastify.post('/presigned-urls', {
    schema: {
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      body: Type.Array(RequestPresignedUrlSchema, { minItems: 1, maxItems: 5 }),
      respose: {
        200: Type.Array(PresignedUrl, { minItems: 1, maxItems: 5 }),
      },
    },
    handler: async (request, reply) => {
      const { productor, producto } = request.params;
      const archivos = request.body;

      // Generar todas las Presigned URLs en paralelo dentro del Backend
      const resultados = await Promise.all(
        archivos.map(async (item) => {
          const lastDotIndex = item.filename.lastIndexOf('.');
          const nombreSinExt = lastDotIndex !== -1 ? item.filename.substring(0, lastDotIndex) : item.filename;
          const slugNombre = productoRepository.createSlug(nombreSinExt) || `imagen-${item.posicion}`;
          const extension = item.contentType.split('/')[1] || 'webp';
          const s3Key = `productos/${productor}/${producto}/${slugNombre}.${extension}`;
          const relativePath = `/${s3Key}`;
          const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
          if (!AWS_S3_BUCKET_NAME) {
            throw new Error('AWS_S3_BUCKET_NAME no está definido en las variables de entorno.');
          }
          const command = new PutObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: s3Key,
            ContentType: item.contentType,
          });

          const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 180 });

          return {
            posicion: item.posicion,
            presignedUrl,
            path: relativePath,
            contentType: item.contentType,
          };
        }),
      );

      return resultados;
    },
  });
};

export default productoImagenesRoutes;
