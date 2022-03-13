import ApiError from '../exceptions/api-error'
import tokenService from '../services/token-service'
import express from 'express';

export default function (req: express.Request, res: express.Response, next: express.NextFunction) {

  next()

  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader)
      return next(ApiError.UnauthorizedError())

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken)
      return next(ApiError.UnauthorizedError())


    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData)
      return next(ApiError.UnauthorizedError())

    req.body.user = userData
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}
