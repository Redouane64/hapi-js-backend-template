import { ResponseObject, ResponseToolkit, Request } from '@hapi/hapi'

/**
 * Http response object
 */
type Response = {
  ok: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any> | {
      message: string | string[]
      stacktrace?: string
  }
}

export const responseFilter = (request: Request, h: ResponseToolkit, err?: Error | undefined): ResponseObject | symbol => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { source: payload, isBoom, stack, output, statusCode } = request.response as any

  /* handler throws error */
  if (isBoom) {
    const response : Response = {
      ok: false,
      result: {
        error: request.response.message,
        stacktrace: stack
      }
    }

    return h.response(response).code(output.statusCode)
  }

  /* all good responses goes through this call */
  return h.response({
    ok: true,
    result: payload
  }).code(statusCode)
}
