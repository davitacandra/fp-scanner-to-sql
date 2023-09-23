import { FastifyInstance } from 'fastify'
import { RowDataPacket } from 'mysql2'

interface Row extends RowDataPacket {
  option: string
  value: string
}

export const cdataRoute = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    const { SN } = request.query as { SN: string }

    const responses = [`GET OPTION FROM: ${SN}`]
    const connection = await fastify.mysql.getConnection()
    const [rows] = await connection.query<Row[]>(
      `SELECT option, value FROM device_option WHERE sn = '${SN}' ORDER BY option`
    )
    if (rows.length > 0) {
      for (const { option, value } of rows) {
        responses.push(`${option}=${value}`)
      }
    } else {
      const [defaultRows] = await connection.query<Row[]>(
        "SELECT option, value FROM device_option WHERE sn = 'default' ORDER BY option"
      )
      for (const { option, value } of defaultRows) {
        responses.push(`${option}=${value}`)
      }
    }
    connection.release()
    reply.send(responses.join('\n'))
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
