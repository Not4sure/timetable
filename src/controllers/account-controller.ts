import accountService from '../services/account-service'
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error'
import express from "express";

class AccountController {
    async getAccount (req: express.Request, res: express.Response, next: express.NextFunction) {
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
}

export default new AccountController()