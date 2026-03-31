// Require the framework
import Fastify from "fastify";
import { app, options } from "./app.ts";

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from "close-with-grace";

// Read and load environment variables from .env files (ignore if not present)
try {
  process.loadEnvFile();
} catch {}

// Instantiate Fastify with some config
const myServer = Fastify({
  logger: true,
});

// Register your application as a normal plugin
myServer.register(app, options);

// delay is the number of milliseconds for the graceful close to finish
closeWithGrace(
  { delay: parseInt(process.env.API_CLOSE_GRACE_DELAY) || 500 },
  async function ({ signal, err, manual }) {
    if (err) {
      myServer.log.error(err);
    }
    await myServer.close();
  } as closeWithGrace.CloseWithGraceAsyncCallback,
);

// Start listening
myServer.listen(
  { port: parseInt(process.env.API_PORT) || 3000 },
  (err: any) => {
    if (err) {
      myServer.log.error(err);
      process.exit(1);
    }
  },
);
