import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Type } from 'fastify-typebox'
import { replyResult } from '../config/fastify.config'
import { UserDto, UserDtoSchema } from '../user/user.model'

const userRoute: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  const userServices = fastify.diContainer.cradle.userServices

  fastify
    .setErrorHandler(async (error, _, reply) => {
      console.error(error)
      reply.status(400).send(new Error(error.message))
    })
    .get('/health', async () => 'OK')
    .get('/', async () => replyResult(await userServices.findAll()))
    .get<{ readonly Params: { readonly id: string } }>(
      '/:id',
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
      '/',
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
