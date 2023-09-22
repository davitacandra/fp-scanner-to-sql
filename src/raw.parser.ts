import { FastifyInstance } from 'fastify'

export const rawParser = (fastify: FastifyInstance) => {
  fastify.addContentTypeParser('*', (_request, payload, done) => {
    let data = ''
    payload.on('data', (chunk) => {
      data += chunk
    })
    payload.on('end', () => {
      done(null, data)
    })
  })
}
