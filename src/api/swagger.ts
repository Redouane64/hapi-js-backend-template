import { RegisterOptions } from 'hapi-swagger'
import * as pkg from '../../package.json'

export const swaggerOptions: RegisterOptions = {
  grouping: 'tags',
  info: {
    title: 'API Documentation',
    version: pkg.version,
    description:
      'API Documentation'
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      'x-keyPrefix': 'Bearer '
    },
    basic: {
      type: 'basic'
    }
  },
  security: [
    {
      Bearer: []
    }
  ],
  jsonPath: '/documentation.json',
  documentationPath: '/documentation',
  debug: true
}
