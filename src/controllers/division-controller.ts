import divisionService from '../services/division-service'
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error'
import express from "express";

class DivisionController {
    async getDivision (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const id = req.params.id
            const division = await divisionService.getById(id)
            res.json(division)
        } catch (e) {
            next(e)
        }
    }

    async getAllDivisions (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const divisions = await divisionService.getAll()
            res.json(divisions)
        } catch (e) {
            next(e)
        }
    }

    async createDivision (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const data = req.body.data
            const id = await divisionService.create(data)
            res.json(id)
        } catch (e) {
            next(e)
        }
    }

}

export default new DivisionController()