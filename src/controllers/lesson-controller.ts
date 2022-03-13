import lessonService from '../services/lesson-service'
import {getWeekNumber} from "../utils";
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error'
import express from "express";

class LessonController {
    async getLesson (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const id = req.params.id
            const lesson = await lessonService.getById(id)
            res.json(lesson)
        } catch (e) {
            next(e)
        }
    }

    async getLessonsByDivision(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const divisionId = req.params.divisionId
            const week = getWeekNumber(req.params.week)
            const lessons = await lessonService.getByDivision(divisionId, week)
            res.json({week: week, lessons: lessons})
        } catch (e) {
            next(e)
        }
    }

    async editLesson(req: express.Request, res: express.Result, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const id = req.params.id
            const data = req.body.data
            const lesson = await lessonService.edit(id, data)
            res.json(lesson)
        } catch (e) {
            next(e)
        }
    }

    async JSON(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return next(ApiError.BadRequest('Ты - ошибка'))
            const data = req.body.data
            await lessonService.createFromJSON(data)
            res.json({'lol': true})
        } catch (e) {
            next(e)
        }
    }

}

export default new LessonController()
