import { Sequelize } from 'sequelize-typescript'
import { Plugin, Server } from '@hapi/hapi'
import * as pkg from '../../package.json'
import { createUser, getUser, isUniqueEmailAddress, UserModel } from './user'

export type DatabaseOptions = Partial<{
  /**
   * create an in-memory test database
   */
  test: boolean

  /**
   * database server host
   */
  host: string

  /**
   * database server port
   */
  port: number

  /**
   * database server username
   */
  username: string

  /**
   * database server password
   */
  password: string

  /**
   * database name
   */
  database: string

  /**
   * database dialect
   */
  dialect: 'postgres' | 'sqlite' /* currently supported */
}>

export const Database: Plugin<DatabaseOptions> = {
  name: 'database',
  version: pkg.version,
  register: async (server: Server, options: DatabaseOptions) => {
    let sequelize: Sequelize
    if (options.test) {
      sequelize = new Sequelize('sqlite::memory:', {
        models: [UserModel],
        logging: false,
        sync: {
          force: true,
          alter: true
        }
      })
      await sequelize.sync()
    } else {
      sequelize = new Sequelize({
        ...options,
        models: [UserModel]
      })
    }

    server.expose({
      /**
       * Get the underlying sequelize object
       * @returns sequelize object
       */
      sequelize: function (): Sequelize {
        return sequelize
      }
    })

    server.method(createUser.name, createUser)
    server.method(getUser.name, getUser)
    server.method(isUniqueEmailAddress.name, isUniqueEmailAddress)
  }
}
