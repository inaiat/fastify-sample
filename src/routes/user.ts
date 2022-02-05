import { UserModel, UserModelSchema } from '@src/user/user.model';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify';
import fp from 'fastify-plugin';

export const UserRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
): Promise<void> => {
  

  fastify
    .setErrorHandler(async (error, req, reply) => {
      console.error(error);
      reply.status(400).send(new Error(error.message));
    })
    .get('/', async (request, reply) => {
      const findAllService = fastify.diContainer.cradle.findAllService;
      return findAllService();
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
        const createUserService = fastify.diContainer.cradle.createUserService;
        const user = req.body as UserModel;
        await createUserService(user);
        reply.status(201).send();
      },
    );
};

export default fp(UserRoute);
