import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript'
import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'

/**
 * user data model
 */
export interface UserDto {
  id: string
  email: string
  password: string
  avatar: string
  createdAt: Date
  updatedAt: Date
}

/**
 * create user data model
 */
export type CreateUser = Omit<UserDto, 'id' | 'avatar' | 'createdAt' | 'updatedAt'>

/**
 * update user data model
 */
export type UpdateUser = Partial<CreateUser>

@Scopes(() => ({
  defaultScope: {
    attributes: {
      exclude: ['password']
    }
  }
}))
@Table({
  tableName: 'users'
})
export class UserModel extends Model<UserDto, CreateUser> implements UserDto {
  @Default(uuid.v4())
  @PrimaryKey
  @Column(DataType.STRING)
  id: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string

  @AllowNull(true)
  @Column(DataType.STRING)
  avatar: string

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date
}

/**
 * Create user
 * @param user user data
 * @returns created user
 */
export const createUser = async (user: CreateUser): Promise<UserDto> => {
  const hashedPassword = await bcrypt.hash(user.password, 1)

  return await UserModel.create({ email: user.email, password: hashedPassword }, {
    raw: true
  })
}

/**
 * Get user that matches provided search query
 * @param user search query
 * @returns User that matches search query or null if not found
 */
export const getUser = async (user: Pick<UserDto, 'email' | 'password'>): Promise<UserDto | null> => {
  if (user.password) {
    return await UserModel.findOne({
      where: { email: user.email, password: user.password },
      raw: true
    })
  }

  return await UserModel.findOne({
    where: { email: user.email },
    raw: true
  })
}

/**
 * Check if e-mail address is already in use
 * @param email user e-mail address
 * @returns `true` if e-mail address is not used, otherwise `false`
 */
export const isUniqueEmailAddress = async (email: string): Promise<boolean> => {
  return (await UserModel.count({ where: { email } })) === 0
}
