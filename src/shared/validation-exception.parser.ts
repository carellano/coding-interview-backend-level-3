import { Request, ResponseToolkit } from "@hapi/hapi"
import { ValidationError } from 'joi'
export function ValidationExceptionParser(_request: Request, h: ResponseToolkit, err: unknown) {
    if (err instanceof ValidationError) {
      const errors = err.details.map((detail) => ({
        field: detail.context?.key || '',
        message: detail.message,
      }))
      return h.response({ errors }).code(400).takeover()
    }
    throw err
  }