import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    mysql: any // You can provide a more specific type if you have one.
  }
}
