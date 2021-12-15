import { AppModule } from '@src/config/app.config';
import { UserModel, UserModelSchema } from '@src/user/user.model';
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

const appModule = new AppModule();
appModule.migrations();

export const UserRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
): Promise<void> => {
  const userService = appModule.getUserService();

  fastify
    .setErrorHandler(async (error, req, reply) => {
      console.error(error);
      reply.status(500);
      reply.send();
    })
    .get('/', async (request, reply) => {
      return userService.findAll();
    })
    .get('/test', async (request, reply) => {
      throw new Error('acabou');
    })
    .post<{ Body: UserModel }>(
      '/',
      {
        schema: {
          body: UserModelSchema,
          response: {
            200: UserModelSchema,
            500: {},
          },
        },
      },
      async (req, reply) => {
        const user = req.body as UserModel;
        await userService.create(user);
        reply.status(201).send();
      },
    );
};

export default fp(UserRoute);
