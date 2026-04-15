// Require the framework
import Fastify from 'fastify';
import { app, options } from './app.js';

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from 'close-with-grace';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

// Read and load environment variables from .env files (ignore if not present)
try {
  process.loadEnvFile();
} catch {}

const isDev = process.env.NODE_ENV === 'development';

const myServer = Fastify({
  logger: isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            colorize: true, //
            singleLine: false,
          },
        },
      }
    : true, // en prod usamos log standard
}).withTypeProvider<TypeBoxTypeProvider>();

// Register your application as a normal plugin
myServer.register(app, options);

// delay is the number of milliseconds for the graceful close to finish
closeWithGrace({ delay: Number(process.env.API_CLOSE_GRACE_DELAY) || 500 }, async function ({
  signal,
  err,
  manual,
}) {
  if (err) {
    myServer.log.error(err);
  }
  await myServer.close();
} as closeWithGrace.CloseWithGraceAsyncCallback);

// Start listening
myServer.listen({ port: Number(process.env.API_PORT) || 3000, host: '::' }, (err: any) => {
  if (err) {
    myServer.log.error(err);
    process.exit(1);
  }
});
