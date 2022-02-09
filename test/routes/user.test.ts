import { asValue } from 'awilix'
import { build } from '../helper'
import { instance, mock, when } from 'strong-mock'
import { UserServices } from '../../src/user/user.service'
import { User } from '../../src/user/user.model'
import { okAsync } from 'neverthrow'
import { BaseException } from '../../src/config/exception'

const findServicesMock = mock<UserServices>()

describe('test user endopint', () => {
  const app = build((env, di) => {
    di.register({
      config: asValue(env),
      userServices: asValue(instance(findServicesMock)),
    })
  })

  test('find find all', async () => {
    const findAllResult = okAsync<readonly User[], BaseException>([
      { name: 'elizeu drummond', age: 65, yearOfBirth: 1957 },
      { name: 'luiz pareto', age: 22, yearOfBirth: 200 },
    ])

    when(findServicesMock.findAll()).thenReturn(findAllResult)

    const res = await app.inject({
      url: '/',
    })
    expect(JSON.parse(res.payload)).toEqual((await findAllResult)._unsafeUnwrap())
  })
})
