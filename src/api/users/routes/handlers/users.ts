import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import { LoginDto, RegisterDto } from '../../schemes'
import * as bcrypt from 'bcrypt'

export const register = async (request: Request, reply: ResponseToolkit): Promise<ResponseObject> => {
  const { email, password, confirmPassword } = request.payload as RegisterDto

  if (password !== confirmPassword) {
    return reply.response({ ok: false, error: 'passwords do not match.' }).code(401)
  }

  const { isUniqueEmailAddress, createUser } = request.server.methods
  if (!await isUniqueEmailAddress(email)) {
    return reply.response({ ok: false, error: 'e-mail address is registered with an existing account.' }).code(401)
  }

  const user = await createUser({ email, password })

  if (user !== null) {
    const { createToken } = request.server.methods
    const accessToken = await createToken(
      user, {
        purpose: 'access',
        // eslint-disable-next-line dot-notation
        lifetime: request.server.plugins['auth'].jwtTokenLifetime
      },
      // eslint-disable-next-line dot-notation
      request.server.plugins['auth'].jwtTokenSecret
    )

    const refreshToken = await createToken(
      user, {
        purpose: 'refresh',
        // eslint-disable-next-line dot-notation
        lifetime: request.server.plugins['auth'].jwtRefreshTokenLifetime
      },
      // eslint-disable-next-line dot-notation
      request.server.plugins['auth'].jwtRefreshTokenSecret
    )

    return reply.response({ token: accessToken, refreshToken: refreshToken }).code(200)
  }

  return reply.response().code(400)
}

export const login = async (request: Request, reply: ResponseToolkit): Promise<ResponseObject> => {
  const { email, password } = request.payload as LoginDto
  const { getUser } = request.server.methods

  const hashedPassword = await bcrypt.hash(password, email)
  const user = await getUser(email, hashedPassword)

  if (user !== null) {
    const { createToken } = request.server.methods
    const accessToken = await createToken(
      user, {
        purpose: 'access',
        // eslint-disable-next-line dot-notation
        lifetime: request.server.plugins['auth'].jwtTokenLifetime
      }
    )

    const refreshToken = await createToken(
      user, {
        purpose: 'refresh',
        // eslint-disable-next-line dot-notation
        lifetime: request.server.plugins['auth'].jwtRefreshTokenLifetime
      }
    )

    return reply.response({ token: accessToken, refreshToken: refreshToken }).code(200)
  }

  return reply.response({ ok: false, error: 'invalid credentials' }).code(401)
}

export const refreshToken = async (request: Request, reply: ResponseToolkit): Promise<ResponseObject> => {
  const { /* credentials, */ artifacts } = request.auth

  const { getUser } = request.server.methods

  const email = artifacts.email
  const user = await getUser(email)

  if (user !== null) {
    const { createToken } = request.server.methods
    const accessToken = await createToken(
      user, {
        purpose: 'access',
        // eslint-disable-next-line dot-notation
        lifetime: request.server.plugins['auth'].jwtTokenLifetime
      }
    )

    const refreshToken = await createToken(
      user, {
        purpose: 'refresh',
        // eslint-disable-next-line dot-notation
        lifetime: request.server.plugins['auth'].jwtRefreshTokenLifetime
      }
    )

    return reply.response({ token: accessToken, refreshToken: refreshToken }).code(200)
  }

  return reply.response().code(404)
}

export const profile = async (request: Request, reply: ResponseToolkit): Promise<ResponseObject> => {
  const { /* credentials, */ artifacts } = request.auth

  const { getUser } = request.server.methods

  const email = artifacts.email
  const user = await getUser(email)

  if (user !== null) {
    return reply.response(user).code(200)
  }

  return reply.response().code(404)
}
