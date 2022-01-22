import * as Joi from 'joi'
import { UserDto } from '../../database/user'

interface Response<T> {
  ok: boolean
  result: T
}

export const ResponseSchema = <T>(): Joi.ObjectSchema<Response<T>> =>
  Joi.object<Response<T>>({
    ok: Joi.boolean(),
    result: Joi.object<T>()
  })

export const UserSchema = (): Joi.ObjectSchema<UserDto> =>
  Joi.object<Omit<UserDto, 'password' | 'createdAt' | 'updatedAt'>>({
    id: Joi.string().uuid(),
    email: Joi.string().email(),
    avatar: Joi.string()
  }).label('User')

export type LoginDto = Pick<UserDto, 'email' | 'password'>

export const LoginSchema = (): Joi.ObjectSchema<LoginDto> => Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}).label('Login')

export type RegisterDto = Pick<UserDto, 'email' | 'password'> & { 'confirmPassword': string }

export const RegisterSchema = (): Joi.ObjectSchema<RegisterDto> => Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required()
}).label('Register')

export const AuthenticationResultSchema = (): Joi.ObjectSchema<RegisterDto> => Joi.object({
  token: Joi.string().required(),
  refreshToken: Joi.string().required()
}).label('AuthenticationResult')

export const RefreshTokenSchema = (): Joi.ObjectSchema<{ refreshToken: string }> => Joi.object({
  refreshToken: Joi.string().required()
}).label('RefreshToken')
