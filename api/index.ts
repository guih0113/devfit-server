import { app } from '../src/server'

export default async (req: Request, res: Response) => {
  await app.ready()
  app.server.emit('request', req, res)
}
