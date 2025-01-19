import cors from '@fastify/cors'
import websocketPlugin from '@fastify/websocket'
import fastify from 'fastify'
import { loadAsset, storeAsset } from './assets'
import { makeOrLoadRoom } from './rooms'
import { unfurl } from './unfurl'

const PORT = 5858

// For this example we use a simple fastify server with the official websocket plugin
// To keep things simple we're skipping normal production concerns like rate limiting and input validation.
const app = fastify()
app.register(websocketPlugin)
app.register(cors, { origin: '*' })

app.register(async (app) => {
  app.get('/', () => {
    return 'Connecting TLDraw Sync Server'
  })
  // This is the main entrypoint for the multiplayer sync
  app.get('/connect/:roomId', { websocket: true }, async (socket, req) => {
    const roomId = (req.params as ConnectRequestParams).roomId
    const { userId, sessionId } = req.query as ConnectRequestQuery

    // Here we make or get an existing instance of TLSocketRoom for the given roomId
    const room = await makeOrLoadRoom(roomId)
    if (!room) {
      // If the room is already loaded, we can connect the socket
      // and we're done
      return
    }
    // and finally connect the socket to the room
    room.handleSocketConnect({
      sessionId,
      socket,
      isReadonly: !userId || userId === 'undefined',
    })
  })

  // To enable blob storage for assets, we add a simple endpoint supporting PUT and GET requests
  // But first we need to allow all content types with no parsing, so we can handle raw data
  app.addContentTypeParser('*', (_, __, done) => done(null))
  app.put('/uploads/:id', {}, async (req, res) => {
    const id = (req.params as UploadRequestParams).id
    await storeAsset(id, req.raw)
    res.send({ ok: true })
  })
  app.get('/uploads/:id', async (req, res) => {
    const id = (req.params as UploadRequestParams).id
    const data = await loadAsset(id)
    res.send(data)
  })

  // To enable unfurling of bookmarks, we add a simple endpoint that takes a URL query param
  app.get('/unfurl', async (req, res) => {
    const url = (req.query as UnfurlRequestQuery).url
    res.send(await unfurl(url))
  })
})

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server started on port ${PORT}`)
})

type ConnectRequestParams = {
  roomId: string
}
type ConnectRequestQuery = {
  sessionId: string
  userId: string
}
type UploadRequestParams = {
  id: string
}
type UnfurlRequestQuery = {
  url: string
}
