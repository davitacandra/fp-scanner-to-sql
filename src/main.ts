import Fastify from 'fastify'
import { config } from 'dotenv'
import fastifyMySQL from '@fastify/mysql'
import rawParser from './raw.parser'
import { cdataRoute } from './cdata.route'
import { getrequestRoute } from './getrequest.route'
import { rootRoute } from './root.route'
import { catchAllRoute } from './catch-all.route'

config()

const PORT = process.env.PORT! || 3000
const MYSQL_URL = process.env.MYSQL_URL

const fastify = Fastify({ logger: true })

fastify.addContentTypeParser('*', rawParser)

fastify.register(fastifyMySQL, { promise: true, connectionString: MYSQL_URL })

fastify.register(cdataRoute, { prefix: '/iclock/cdata' })
fastify.register(getrequestRoute, { prefix: '/iclock/getrequest' })
fastify.register(rootRoute)
fastify.register(catchAllRoute)

fastify.listen({ port: +PORT }, (err) => {
  if (err) throw err
})
