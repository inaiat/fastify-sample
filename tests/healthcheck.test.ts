import test from 'ava'
import {build} from './helpers/helper.js'

test('default health route', async t => {
	const app = await build(t, {}, ['healthcheck'])

	const response = await app.inject({
		url: '/health',
	})

	t.deepEqual(JSON.parse(response.payload), {status: 'OK'})
})
