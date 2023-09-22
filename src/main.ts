import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { config } from 'dotenv'

config()

const PORT = process.env.PORT! || 3000

const fastify = Fastify({ logger: true })

fastify.addContentTypeParser('*', (_request, payload, done) => {
  let data = ''
  payload.on('data', (chunk) => {
    data += chunk
  })
  payload.on('end', () => {
    done(null, data)
  })
})

fastify.get('/iclock/cdata', (request: FastifyRequest, reply: FastifyReply) => {
  const { SN } = request.query as { SN: string }

  const response = `GET OPTION FROM: ${SN}
Stamp=9999
OpStamp=0
ErrorDelay=60
Delay=30
TransTimes=00:00;14:05
TransInterval=1
TransFlag=1000000000
TimeZone=7
Realtime=1
Encrypt=0`

  reply.send(response)
})

fastify.get('/iclock/getrequest', (request, reply) => {
  const { SN } = request.query as { SN: string }

  // FIXME: check for remote command
  console.log(SN)
  reply.send('OK')
})

fastify.get('/', (_request, reply) => {
  reply.send('OK')
})

fastify.all('*', (request, reply) => {
  console.log(request.method)
  console.log(request.url)
  console.log(request.headers)
  console.log(request.body)
  reply.send('OK')
})

fastify.listen({ port: +PORT }, (err) => {
  if (err) throw err
})
