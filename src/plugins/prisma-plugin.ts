import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export default fp<FastifyPluginAsync>(
  async (fastify) => {
    const prisma = new PrismaClient()
    await prisma.$connect()
    fastify.decorate('prisma', prisma)
    fastify.addHook('onClose', async (server) => {
      await server.prisma.$disconnect()
    })
  },
  { name: 'prisma' }
)
