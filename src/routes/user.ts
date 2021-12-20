import { UserModel, UserModelSchema } from '@src/user/user.model';
import { UserService } from '@src/user/user.service';
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
  
  const userService = fastify.diContainer.resolve<UserService>("userService");

  fastify
    .setErrorHandler(async (error, req, reply) => {
      console.error(error);
      reply.status(400).send(new Error(error.message));
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
