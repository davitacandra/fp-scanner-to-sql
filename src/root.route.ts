import { FastifyInstance } from 'fastify'

export const rootRoute = (fastify: FastifyInstance) => {
  fastify.get('/', (_request, reply) => {
    reply.send('OK')
  })
}
