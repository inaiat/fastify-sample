import { UserModel, UserModelSchema } from '@src/user/user.model'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Type } from 'fastify-typebox'

const userRoute: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  const findServices = await fastify.diContainer.cradle.findServices()

  fastify
    .setErrorHandler(async (error, _, reply) => {
      console.error(error)
      reply.status(400).send(new Error(error.message))
    })
    .get('/', async (_, reply) => {
      const findAll = await findServices.findAll()
      if (findAll.isOk()) {
        return findAll.value
      } else {
        return reply.send(findAll.error.throwable)
      }
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
    .get<{ Params: { id: string } }>(
      '/user:id',
      {
        schema: {
          params: Type.Object({ code: Type.String() }),
        },
      },
      async (request) => {
        const { id } = request.params
        const findById = await findServices.findById(id)
        if (findById.isOk()) {
          return findById.value
        } else {
          return findById.error.throwable
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
        const createUser = await createUserService(user)
        if (createUser.isOk()) {
          return createUser.value
        } else {
          return createUser.error.throwable
        }
      }
    )
}

export default userRoute
