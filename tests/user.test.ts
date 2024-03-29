import anyTest, {TestFn} from 'ava'
import {instance, mock, when} from 'strong-mock'
import {okAsync} from 'neverthrow'
import {asFunction, asValue} from 'awilix'
import {FastifyInstance} from 'fastify'
import {ObjectId} from 'mongodb'
import {UserRepository} from '../src/user/user.repository.js'
import {User} from '../src/user/user.model.js'
import {defaultUserServices} from '../src/user/user.service.js'
import {ResultError} from '../src/plugins/error.handler.js'
import {build, UserRepoType} from './helpers/helper.js'

const userRepository = mock<UserRepository>()

const test = anyTest as TestFn<FastifyInstance>

test.beforeEach(async t => {
	const app = await build(
		t,
		{
			config: asValue(mock()),
			userCollection: asValue(instance(mock())),
			userRepository: asValue(instance(userRepository)),
			userServices: asFunction(defaultUserServices),
		},
		['user'],
	)
	t.context = app
})

test('find all', async t => {
	const findAllResult = okAsync<readonly User[], ResultError>([
		{name: 'elizeu drummond', age: 65, phone: '2461212'},
		{name: 'luiz pareto', age: 22, phone: '2461213'},
	])

	when(userRepository.findall()).thenReturn(findAllResult)

	const response = await t.context.inject({
		url: '/user',
	})

	t.deepEqual(JSON.parse(response.payload), (await findAllResult)._unsafeUnwrap())
})

test('should result status 200 on find by id', async t => {
	when(userRepository.findById('xyz')).thenReturn(
		okAsync<UserRepoType>({_id: new ObjectId(), name: 'elizeu drummond', phone: '2461212', age: 90}),
	)

	const response = await t.context.inject({
		url: '/user/xyz',
	})

	t.is(response.statusCode, 200)
})

test('should return status 404 on find by an id that does not exist', async t => {
	when(userRepository.findById('xyz')).thenReturn(okAsync<UserRepoType | undefined>(undefined))

	const response = await t.context.inject({
		url: '/user/xyz',
	})

	t.is(response.statusCode, 404)
})
