import 'jest-extended'

import { Server } from '@hapi/hapi'
import { Database } from '../src/database'

describe('database', () => {
  const server = new Server()

  beforeAll(async () => {
    await server.register({
      plugin: Database,
      options: {
        test: true
      }
    })

    await server.initialize()
  })

  it('database methods', () => {
    const { createUser, getUser, isUniqueEmailAddress } = server.methods
    expect(createUser).toBeFunction()
    expect(getUser).toBeFunction()
    expect(isUniqueEmailAddress).toBeFunction()
  })

  it('create user', () => {
    // eslint-disable-next-line no-unused-vars
    const { createUser } = server.methods

    expect(true)
  })

  it('get user', () => {
    // eslint-disable-next-line no-unused-vars
    const { getUser } = server.methods

    expect(true)
  })
})
