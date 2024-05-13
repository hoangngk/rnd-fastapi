import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/search', (response) => {
  return response.json({})
})

export const GET = handle(app)
export default app as never
