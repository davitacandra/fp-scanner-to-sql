import { FastifyInstance } from 'fastify'

export const cdataRoute = async (fastify: FastifyInstance) => {
  fastify.get('/', (request, reply) => {
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

  fastify.post('/iclock/cdata', (request, reply) => {
    const { SN, table, Stamp } = request.query as {
      SN: string
      table: string
      Stamp: string
    }

    console.log(SN)
    console.log(table)
    console.log(Stamp)
    console.log(request.body)
    reply.send('OK: 1')
  })
}
