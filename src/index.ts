import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { UserRoute } from './routes/user';

export type AppOptions = {
  // Place your custom options for app below here.
};
export const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  fastify.register(require('fastify-swagger'), {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0',
      },
      schemes: ['http'],
    },
  });
  fastify.register(UserRoute);
};

const server: FastifyInstance = fastify({ logger: true });

server.register(app);

const start = async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

export default app;
