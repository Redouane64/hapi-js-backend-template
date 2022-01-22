import { Plugin, Server } from '@hapi/hapi'
import * as HapiSwagger from 'hapi-swagger'
import * as pkg from '../../package.json'
import { swaggerOptions } from './swagger'
import { Users } from './users'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Api: Plugin<any> = {
  name: 'api',
  version: pkg.version,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: async (server: Server, options: any) => {
    server.realm.modifiers.route.prefix = '/api'

    await server.register({
      plugin: HapiSwagger,
      options: swaggerOptions
    })

    server.register(Users, { routes: { prefix: '/v1' } })
  }
}
