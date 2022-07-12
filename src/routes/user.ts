import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { replyResult } from '../config/fastify.config.js'
import { UserDto, UserDtoSchema } from '../user/user.model.js'

const userRoute: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  const userServices = fastify.diContainer.cradle.userServices

  fastify
    .setErrorHandler(async (error, _, reply) => {
      console.error(error)
      await reply.status(400).send(new Error(error.message))
    })
    .get('/health', async () => 'OK')
    .get('/user', async () => replyResult(await userServices.findAll()))
    .get<{ readonly Params: { readonly id: string } }>(
      '/user/:id',
      {
        schema: {
          params: Type.Object({ id: Type.String() }),
        },
      },
      async (request) => {
        const { id } = request.params
        return replyResult(await userServices.findById(id))
      }
    )
    .post<{ readonly Body: UserDto }>(
      '/user',
      {
        schema: {
          body: UserDtoSchema,
          response: {
            200: UserDtoSchema,
            500: {},
          },
        },
      },
      async (req) => {
        const user = req.body as UserDto
        return replyResult(await userServices.create(user))
      }
    )
}

export default userRoute
