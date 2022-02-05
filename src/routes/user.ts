import { UserModel, UserModelSchema } from '@src/user/user.model'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Type } from 'fastify-typebox'
import { REPL_MODE_SLOPPY } from 'repl'

const userRoute: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify
    .setErrorHandler(async (error, req, reply) => {
      console.error(error)
      reply.status(400).send(new Error(error.message))
    })
    .get('/', async () => {
      const findAllService = fastify.diContainer.cradle.findAllService
      return findAllService()
    })
    .get<{ Params: { code: number } }>(
      '/code/:code',
      {
        schema: {
          params: Type.Object({ code: Type.Number({ minimum: 200, maximum: 599 }) }),
        },
      },
      async (request, reply) => {
        const { code } = request.params
        if (code >= 400) {
          reply.badRequest('something wrong')
        } else {
          reply.send("It's fine.")
        }
      }
    )
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
        const createUserService = fastify.diContainer.cradle.createUserService
        const user = req.body as UserModel
        await createUserService(user)
        reply.status(201).send()
      }
    )
}

export default userRoute
