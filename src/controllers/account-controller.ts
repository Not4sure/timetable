import accountService from '../services/account-service'
import telegramService from '../services/telegram-service'
import tokenService from '../services/token-service'
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error'
import express from "express";

class AccountController {

    async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const tgLoginData = req.body.tgLogin
            if (!tgLoginData || !telegramService.checkLoginData(tgLoginData))
                return next(ApiError.BadRequest('Invalid telegram data'))
            const account = await accountService.login(tgLoginData.id, tgLoginData)
            const tokens = tokenService.generateTokens({id: account._id, accessGroups: account.accessGroups})
            res.json({...tokens, account: account})
        } catch (e) {
            next(e)
        }
    }

    //todo: auth
    async getAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const id = req.params.id
            const account = await accountService.get(id)
            res.json(account)
        } catch (e) {
            next(e)
        }
    }

    //todo: validate request
    async createAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const data = req.body.data
            const account = await accountService.create(data)
            res.json(account)
        } catch (e) {
            next(e)
        }
    }
}

export default new AccountController()