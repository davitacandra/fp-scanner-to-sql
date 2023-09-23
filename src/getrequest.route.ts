import { FastifyInstance } from 'fastify'
import { RowDataPacket } from 'mysql2'

interface Row extends RowDataPacket {
  id: string
  command: string
}

export const getrequestRoute = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    const { SN } = request.query as { SN: string }
    const connection = await fastify.mysql.getConnection()
    const responses = []
    const [rows] = await connection.query<Row[]>(
      `SELECT id, command FROM device_command WHERE sn = '${SN}' AND executed = 0 ORDER BY id LIMIT 1`
    )
    if (rows.length > 0) {
      const { id, command } = rows[0]
      responses.push(`C:${id.toString().padStart(3, '0')}:${command}`)
      // FIXME:
      connection.query(
        `UPDATE device_command SET executed = 1 WHERE executed = 0 AND id = ${id} AND command = '${command}' AND sn = '${SN}'`
      )
    } else {
      responses.push('OK')
    }
    connection.release()
    reply.send(responses.join('\n'))
  })
}
