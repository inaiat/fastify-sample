import { FastifyPluginAsync } from 'fastify'

const healthcheck: FastifyPluginAsync = async (fastify) => {
  void fastify.get('/health', { logLevel: 'warn' }, async () => ({ status: 'OK' }))
}

export default healthcheck
