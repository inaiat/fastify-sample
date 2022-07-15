import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { UserDto, UserDtoSchema } from '../user/user.model.js'

const userRoute: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  const userServices = fastify.diContainer.cradle.userServices

  fastify
    .get('/health', async () => 'OK')
    .get('/user', async (_, reply) => reply.result(await userServices.findAll()))
    .get<{ readonly Params: { readonly id: string } }>(
      '/user/:id',
      {
        schema: {
          params: Type.Object({ id: Type.String() }),
        },
      },
      async (request, reply) => {
        const { id } = request.params
        return reply.result(await userServices.findById(id))
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
      async (req, reply) => {
        const user = req.body as UserDto
        return reply.result(await userServices.create(user))
      }
    )
}

export default userRoute
