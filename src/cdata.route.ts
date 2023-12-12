import { FastifyInstance } from 'fastify'
import { RowDataPacket } from 'mysql2'

interface Row extends RowDataPacket {
  id: string
  command: string
}

export const cdataRoute = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    const { SN } = request.query as { SN: string }
    const responses = [`GET OPTION FROM: ${SN}`]
    const connection = await fastify.mysql.getConnection()
    const [rows]: [Row[]] = await connection.query(
      `SELECT option, value FROM device_option WHERE sn = ? ORDER BY option`,
      [SN]
    )

    if (rows.length > 0) {
      for (const { option, value } of rows) {
        responses.push(`${option}=${value}`)
      }
    } else {
      const [defaultRows]: [Row[]] = await connection.query(
        "SELECT option, value FROM device_option WHERE sn = 'default' ORDER BY option"
      )
      for (const { option, value } of defaultRows) {
        responses.push(`${option}=${value}`)
      }
    }

    connection.release()
    reply.send(responses.join('\n'))
  })

  fastify.post('/', async (request, reply) => {
    const { SN, table } = request.query as {
      SN: string
      table: string
    }

    const connection = await fastify.mysql.getConnection()

    try {
      const lines = (request.body as string).trim().split('\n')

      for (const line of lines) {
        // Parse OPERLOG data (e.g., "USER PIN=10 Name=Putri ...")
        if (table === "OPERLOG" && line.startsWith("USER PIN")) {
          const pinMatch = line.match(/PIN=(\d+)/)
          const nameMatch = line.match(/Name=([\w\s]+)\s+/)
          if (pinMatch && nameMatch) {
            const pin = pinMatch[1]
            const name = nameMatch[1].trim()
            await connection.query(
              'INSERT INTO device_operlog (sn, pin, name) VALUES (?, ?, ?)',
              [SN, pin, name]
            )
          }
          continue
        }    

        const parts = line.split(/\s+/)
        if (parts.length < 3) continue // Skip any lines that don't have the expected data

        const pin = parts[0];
        if (isNaN(Number(pin))) {
          console.error('Invalid PIN:', pin)
          continue
        }

        // Insert data into device_attlog table
        await connection.query(
          'INSERT INTO device_attlog (sn, pin, clock_time) VALUES (?, ?, ?)',
          [SN, pin, new Date(`${parts[1]} ${parts[2]}`)]
        )

        const [existingPins]: [Row[]] = await connection.query(
          'SELECT pin FROM device_operlog WHERE pin = ?',
          [pin]
        )

        if (existingPins.length === 0) {
          const commandToFetchUser = `DATA QUERY USERINFO PIN=${pin}`;
          await connection.query(
            `INSERT INTO device_command (id, sn, command, executed) VALUES (1, ?, ?, 0)
             ON DUPLICATE KEY UPDATE command=?, executed=0`,
            [SN, commandToFetchUser, commandToFetchUser]
          );
        }
      }

      console.log("POST", request.raw.url) // This logs the full URL with query parameters
      console.log(request.headers)
      console.log(request.body)
      reply.send('OK: 1')
    } catch (error) {
      console.error('Error processing request:', error)
      reply.status(500).send('Internal Server Error')
    } finally {
      connection.release()
    }
  })
}