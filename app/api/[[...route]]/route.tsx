import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { env } from 'hono/adapter'
import { Redis } from '@upstash/redis'

export const runtime = 'edge'

const app = new Hono().basePath('/api')
type EnvConfig = {
  UPSTASH_REDIS_REST_TOKEN: string
  UPSTASH_REDIS_REST_URL: string
}
app.get('/search', async (context) => {
  try {
    const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
      env<EnvConfig>(context)

    const redis = new Redis({
      token: UPSTASH_REDIS_REST_TOKEN,
      url: UPSTASH_REDIS_REST_URL
    })

    const query = context.req.query('q')?.toUpperCase()

    if (!query) {
      return context.json({ message: 'No query provided', status: 400 })
    }

    const res: string[] = []
    const rank = await redis.zrank('terms', query)

    if (rank !== null && rank !== undefined) {
      const range = await redis.zrange<string[]>('terms', rank, rank + 100)

      for (const term of range) {
        if (!term.startsWith(query)) {
          break
        }

        if (term.endsWith('*')) {
          res.push(term.slice(0, -1))
        }
      }
    }

    return context.json({
      results: res
    })
  } catch (error) {
    console.log('Error:', error)
    return context.json({ message: 'Something went wrong', status: 500 })
  }
})

export const GET = handle(app)
export default app as never
