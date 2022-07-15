import test from 'ava'
import { build } from './helpers/helper.js'

test('default health route', async (t) => {
  const app = await build(t, {}, ['healthcheck'])

  const res = await app.inject({
    url: '/health',
  })

  t.deepEqual(JSON.parse(res.payload), { status: 'OK' })
})
