// This file contains code that we reuse between our tests.
import Fastify from 'fastify';
import { app, options } from '../src/app.ts';
import fp from 'fastify-plugin';
import * as test from 'node:test';

export type TestContext = {
  after: typeof test.after;
};

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {
    ...options,
    skipOverride: true, // Register our application with fastify-plugin
  };
}

// Automatically build and tear down our instance
async function build(t: TestContext) {
  // you can set all the options supported by the fastify CLI command
  // Instantiate Fastify with some config
  const myServer = Fastify({
    logger: false,
  });

  // fastify-plugin para asegurarnos que no se crea un nuevo contexto y siguen funcionando los decoradores.
  myServer.register(fp(app), config());
  await myServer.ready();
  // Tear down our app after we are done
  // eslint-disable-next-line no-void
  t.after(() => void myServer.close());

  return myServer;
}

export { config, build };
