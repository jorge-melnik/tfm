import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { productoRepository } from '@repositories/producto.repository.js';

import {
  ImagenProducto,
  PresignedUrl,
  Producto,
  RequestPresignedUrlSchema,
} from '@schemas/producto.schema.js';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ErrorResponse } from '@schemas/core.schemas.js';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const productoImagenesRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.put('/', {
    schema: {
      tags: ['Productores', 'Productos'],
      summary: 'UPDATE imágenes producto',
      description: `
        Permite modificar de una única vez todas las imágenes, con su path y posición.
      `,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      body: Type.Array(ImagenProducto),
      response: {
        204: Type.Null(),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    handler: async (req, reply) => {
      reply.code(204);
      const producto = await productoRepository.getOneBy({ producto: req.params.producto });
      await productoRepository.updateImagenes(producto.id_producto, req.body);
    },
  });

  fastify.post('/presigned-urls', {
    schema: {
      tags: ['Productores', 'Productos'],
      summary: 'PRESIGNED URL',
      description: `
        Esté método se encarga de obtener una url prefirmada de un solo uso en el almacenamiento en la nube para que se suban las imágenes del producto directamente desde el frontend al almacenamiento.
      `,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      body: Type.Array(RequestPresignedUrlSchema, { minItems: 1, maxItems: 5 }),
      respose: {
        200: Type.Array(PresignedUrl, { minItems: 1, maxItems: 5 }),
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    preHandler: async (req, reply) => {
      await productoRepository.getOneBy({ producto: req.params.producto });
    },
    handler: async (req, reply) => {
      const { productor, producto } = req.params;
      const archivos = req.body;

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
