import subjectService from '../services/subject-service'
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error'
import express from "express";

class SubjectController {
    async getSubject (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const id = req.params.id
            const subject = await subjectService.get(id)
            res.json(subject)
        } catch (e) {
            next(e)
        }
    }
}

export default new SubjectController()