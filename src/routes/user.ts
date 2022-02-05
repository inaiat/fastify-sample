import { AppError } from '@src/config/app.config'
import { User, UserModel, UserModelSchema } from '@src/user/user.model'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Type } from 'fastify-typebox'

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
        const result = (await createUserService(user)).match(
          (user: User) => {
            req.log.info('User {} created', user)
            return 201
          },
          (error: AppError) => {
            if (error.validationError) throw error.throwable
            req.log.error({ error }, 'error on create user')
            return 500
          }
        )

        reply.status(result).send()
      }
    )
}

export default userRoute
