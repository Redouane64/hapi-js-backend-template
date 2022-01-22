import { Plugin, Server } from '@hapi/hapi'
import { register, login, profile, refresh } from './routes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Users: Plugin<any> = {
  name: 'Users',
  version: '1',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: async (server: Server, options: any) => {
    server.route([register, login, profile, refresh])
  }
}
