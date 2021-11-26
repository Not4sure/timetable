import ApiError from '../exceptions/api-error'
import express from 'express';
import {TelegramLogin} from 'node-telegram-login'

const tgToken = process.env.TG_TOKEN ?? ''
const tgLoginChecker = new TelegramLogin(tgToken)

export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const userData = req.body.tgLogin
    if(!userData)
      return next(ApiError.UnauthorizedError())

    if(!tgLoginChecker.checkLoginData(userData))
      return next(ApiError.UnauthorizedError())

    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}
