export default (_request: any, payload: any, done: any) => {
  let data = ''
  payload.on('data', (chunk: any) => {
    data += chunk
  })
  payload.on('end', () => {
    done(null, data)
  })
}
