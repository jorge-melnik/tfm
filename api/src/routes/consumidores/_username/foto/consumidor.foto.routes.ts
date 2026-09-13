import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { PresignedUrl, RequestPresignedUrlSchema } from '@schemas/producto.schema.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ErrorResponse } from '@schemas/core.schemas.js';
import { Consumidor } from '@schemas/consumidores.schema.js';
import { consumidorRepository } from '@repositories/consumidor.repository.js';
import { datosPersonalesRepository } from '@repositories/datos-personales.respository.js';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const consumidorFotoRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.put('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'UPDATE foto consumidor',
      description: `
        Permite modificar la foto de perfil del consumidor.
      `,
      params: Type.Object({ username: Consumidor.properties.username }),
      body: Type.Object({ foto_url: Consumidor.properties.foto_url }),
      response: {
        204: Type.Null(),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    handler: async (req, reply) => {
      reply.code(204);
      const usuario = await consumidorRepository.getOneBy({ username: req.params.username });
      await datosPersonalesRepository.update(usuario.id_consumidor, { foto_url: req.body.foto_url });
    },
  });

  fastify.post('/presigned-urls', {
    schema: {
      tags: ['Consumidores'],
      summary: 'PRESIGNED URL',
      description: `
        Esté método se encarga de obtener una url prefirmada de un solo uso en el almacenamiento en la nube para que se suba la imagen de perfil del consumidor directamente desde el frontend al almacenamiento.
      `,
      params: Type.Object({ username: Consumidor.properties.username }),
      body: RequestPresignedUrlSchema,
      respose: {
        200: Type.Array(PresignedUrl, { minItems: 1, maxItems: 5 }),
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    handler: async (req, reply) => {
      const { username } = req.params;
      const item = req.body;
      // const extension = item.contentType.split('/')[1] || 'webp';
      const s3Key = `usuarios/${username}/${item.filename}`; //Al usar username en el nombre del archivo, siempre se reemplaza
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
        presignedUrl,
        path: relativePath,
        contentType: item.contentType,
      };
    },
  });
};

export default consumidorFotoRoutes;
