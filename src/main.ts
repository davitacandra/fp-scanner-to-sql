import Fastify from 'fastify'
import { config } from 'dotenv'
import rawParser from './raw.parser'
import { cdataRoute } from './cdata.route'
import { getrequestRoute } from './getrequest.route'
import { rootRoute } from './root.route'
import { catchAllRoute } from './catch-all.route'

config()

const PORT = process.env.PORT! || 3000

const fastify = Fastify({ logger: true })

fastify.addContentTypeParser('*', rawParser)

fastify.register(cdataRoute, { prefix: '/iclock/cdata' })
fastify.register(getrequestRoute, { prefix: '/iclock/getrequest' })
fastify.register(rootRoute)
fastify.register(catchAllRoute)

fastify.listen({ port: +PORT }, (err) => {
  if (err) throw err
})
