import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Type } from 'fastify-typebox'
import { UserModel, UserModelSchema } from '../user/user.model'

const userRoute: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  const userServices = fastify.diContainer.cradle.userServices

  fastify
    .setErrorHandler(async (error, _, reply) => {
      console.error(error)
      reply.status(400).send(new Error(error.message))
    })
    .get('/', async () => {
      const findAll = await userServices.findAll()
      if (findAll.isOk()) {
        return findAll.value
      } else {
        return findAll.error.throwable
      }
    })
    .get<{ readonly Params: { readonly id: string } }>(
      '/:id',
      {
        schema: {
          params: Type.Object({ id: Type.String() }),
        },
      },
      async (request) => {
        const { id } = request.params
        const findById = await userServices.findById(id)
        if (findById.isOk()) {
          return findById.value
        } else {
          return findById.error.throwable
        }
      }
    )
    .post<{ readonly Body: UserModel }>(
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
      async (req) => {
        const user = req.body as UserModel
        const createUser = await userServices.create(user)
        if (createUser.isOk()) {
          return createUser.value
        } else {
          return createUser.error.throwable
        }
      }
    )
}

export default userRoute
