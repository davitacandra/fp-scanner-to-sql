import { FastifyInstance } from 'fastify'

export const getrequestRoute = (fastify: FastifyInstance) => {
  fastify.get('/', (request, reply) => {
    const { SN } = request.query as { SN: string }

    // FIXME: check for remote command
    console.log(SN)
    reply.send('OK')
  })
}
