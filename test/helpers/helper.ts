import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ExecutionContext } from 'ava'
import fastifyAutoload from '@fastify/autoload'
import { NameAndRegistrationPair } from 'awilix'
import Fastify from 'fastify'
import { Cradle, diContainer, fastifyAwilixPlugin } from '@fastify/awilix/lib/classic/index.js'
import { serverOptions } from '../../src/config/fastify.config.js'
import { WithId } from 'mongodb'
import { ObjectType } from 'papr/esm/types.js'
import { User } from '../../src/user/user.model.js'

export type UserRepoType = WithId<ObjectType<WithId<User>>>

/**
* Helper to build fastify app for ours tests
* @param {NameAndRegistrationPair<Cradle>} diConfig - the modules that we can inject
* @param {string[]} scriptPattern - The name of script of routes that we can tests
*
* @example
const app = build({
    config: asValue(mock()),
    myUseCase: asValue(instance(myUseCase)),
    myFunction: asValue(instance(myFunction)),
    myRepository: asValue(instance(myRepository)),
  }, ['myusecase'])
*
*/
export async function build(
  t: ExecutionContext,
  diConfig: NameAndRegistrationPair<Cradle>,
  scriptPattern: string[] = []
) {
  const app = Fastify(serverOptions)
  diContainer.register(diConfig)

  void app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: false,
  })
  await app.register(fastifyAutoload, {
    dir: join(dirname(fileURLToPath(import.meta.url)), '../../src/routes'),
    scriptPattern: new RegExp(`(${scriptPattern.join('|')})`),
    forceESM: true,
  })

  await app.ready()

  return app
}
