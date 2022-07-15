import { build, UserRepoType } from './helpers/helper.js'
import anyTest, { TestFn } from 'ava'
import { instance, mock, when } from 'strong-mock'
import { defaultUserServices } from '../src/user/user.service.js'
import { User } from '../src/user/user.model.js'
import { okAsync } from 'neverthrow'
import { asFunction, asValue } from 'awilix'
import { UserRepository } from '../src/user/user.repository.js'
import { FastifyInstance } from 'fastify'
import { ObjectId } from 'mongodb'
import { ResultError } from '../src/plugins/error.handler.js'

const userRepository = mock<UserRepository>()

const test = anyTest as TestFn<FastifyInstance>

test.beforeEach(async (t) => {
  const app = await build(
    t,
    {
      config: asValue(mock()),
      userCollection: asValue(instance(mock())),
      userRepository: asValue(instance(userRepository)),
      userServices: asFunction(defaultUserServices),
    },
    ['user']
  )
  t.context = app
})

test('find all', async (t) => {
  const findAllResult = okAsync<readonly User[], ResultError>([
    { name: 'elizeu drummond', age: 65, yearOfBirth: 1957 },
    { name: 'luiz pareto', age: 22, yearOfBirth: 200 },
  ])

  when(userRepository.findall()).thenReturn(findAllResult)

  const res = await t.context.inject({
    url: '/user',
  })

  t.deepEqual(JSON.parse(res.payload), (await findAllResult)._unsafeUnwrap())
})

test('should result status 200 on find by id', async (t) => {
  when(userRepository.findById('xyz')).thenReturn(
    okAsync<UserRepoType>({ _id: new ObjectId(), name: 'elizeu drummond', yearOfBirth: 1965, age: 90 })
  )

  const res = await t.context.inject({
    url: '/user/xyz',
  })

  t.is(res.statusCode, 200)
})

test('should result in status 404 on find by an id that does not exist', async (t) => {
  when(userRepository.findById('xyz')).thenReturn(okAsync<UserRepoType | null>(null))

  const res = await t.context.inject({
    url: '/user/xyz',
  })

  t.is(res.statusCode, 404)
})
