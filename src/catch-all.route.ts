import { FastifyInstance } from 'fastify'

export const catchAllRoute = (fastify: FastifyInstance) => {
  fastify.all('*', (request, reply) => {
    console.log(request.method)
    console.log(request.url)
    console.log(request.headers)
    console.log(request.body)
    reply.send('OK')
  })
}
