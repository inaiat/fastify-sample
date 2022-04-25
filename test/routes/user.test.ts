import { build } from '../helper'
import { instance, mock, when } from 'strong-mock'
import { defaultUserServices } from '../../src/user/user.service'
import { User } from '../../src/user/user.model'
import { okAsync } from 'neverthrow'
import { BaseError } from '../../src/config/error.handler'
import { asFunction, asValue } from 'awilix'
import { UserRepository } from '../../src/user/user.repository'

const userRepository = mock<UserRepository>()

describe('test user endopint', () => {  

  const app = build({
    config: mock(),
    userCollection: asValue(instance(mock())),
    userRepository: asValue(instance(userRepository)),
    userServices: asFunction(defaultUserServices)
  });
  
  test('find all', async () => {    

    const findAllResult = okAsync<readonly User[], BaseError>([
      { name: 'elizeu drummond', age: 65, yearOfBirth: 1957 },
      { name: 'luiz pareto', age: 22, yearOfBirth: 200 },
    ])

    when(userRepository.findall()).thenReturn(findAllResult)

    const res = await app.inject({
      url: '/',
    })
    expect(JSON.parse(res.payload)).toEqual((await findAllResult)._unsafeUnwrap())
  })
})
