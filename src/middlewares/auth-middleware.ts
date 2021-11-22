import ApiError from '../exceptions/api-error'
import express from "express";

export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const user = req.body.tgUser
    if (user !== 'admin') {
      return next(ApiError.UnauthorizedError())
    }

    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}
