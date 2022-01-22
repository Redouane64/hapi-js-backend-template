import 'jest-extended'

import { Server } from '@hapi/hapi'
import { Auth } from '../src/auth'

describe('auth', () => {
  const server = new Server()

  beforeAll(async () => {
    await server.register({
      plugin: Auth
    })

    await server.initialize()
  })

  it('auth methods', () => {
    const { createToken, verifyToken } = server.methods
    expect(createToken).toBeFunction()
    expect(verifyToken).toBeFunction()
  })

  it('create access token', async () => {
    const result = await server.methods.createToken({
      id: 'D312C8FE-39A1-493B-9B06-5954E97F8E9F',
      email: 'test@test.com'
    }, { purpose: 'access', lifetime: 3600 }, '37D6E247-CE52-4F7B-8747-BFC6279A0972')

    expect(result).toBeString()
  })

  it('create refresh token', async () => {
    const result = await server.methods.createToken({
      id: 'D312C8FE-39A1-493B-9B06-5954E97F8E9F',
      email: 'test@test.com'
    }, { purpose: 'refresh', lifetime: 5000 }, '37D6E247-CE52-4F7B-8747-BFC6279A0972')

    expect(result).toBeString()
  })

  it('verify access token', async () => {
    const secret = '37D6E247-CE52-4F7B-8747-BFC6279A0972'
    const purpose = 'access'

    const token = await server.methods.createToken({
      id: 'D312C8FE-39A1-493B-9B06-5954E97F8E9F',
      email: 'test@test.com'
    }, { purpose: purpose, lifetime: 5000 }, secret)

    const result = await server.methods.verifyToken(
      token,
      purpose,
      secret
    )

    expect(result).toBeObject()
    expect(result.isValid).toBeTrue()
    expect(result.decoded).toBeObject()
    expect(result.decoded.email).toBeString()
    expect(result.decoded.id).toBeString()
    expect(result.decoded.purpose).toBe(purpose)
  })

  it('verify refresh token', async () => {
    const secret = '37D6E247-CE52-4F7B-8747-BFC6279A0972'
    const purpose = 'refresh'
    const token = await server.methods.createToken({
      id: 'D312C8FE-39A1-493B-9B06-5954E97F8E9F',
      email: 'test@test.com'
    }, { purpose: 'refresh', lifetime: 5000 }, secret)

    const result = await server.methods.verifyToken(
      token,
      purpose,
      secret
    )

    expect(result).toBeObject()
    expect(result.isValid).toBeTrue()
    expect(result.decoded).toBeObject()
    expect(result.decoded.email).toBeString()
    expect(result.decoded.id).toBeString()
    expect(result.decoded.purpose).toBe(purpose)
  })
})
