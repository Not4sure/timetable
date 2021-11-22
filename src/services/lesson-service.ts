import Lesson from '../models/lesson-model'
import ApiError from "../exceptions/api-error";

class LessonService {
    async getById(id: string) {
        const lesson = await Lesson
            .findById(id)
            .populate('subject')
            .populate('lecturers')
            .populate('divisions')
            .then()
        if (!lesson)
            throw ApiError.BadRequest(`No lesson with such id`)
        return lesson
    }

    async getByDivision(divisionId: string, week?: number) {
        const repeat = week ? (week % 2 ? ['odd', 'all'] : ['even', 'all']) : ['odd', 'even', 'all']
        console.log(repeat, divisionId)
        const lessons = await Lesson
            .find({divisions: divisionId, repeat: repeat})
            .populate('subject')
            .populate('lecturers')
            .populate('divisions')
            .then()
        if (lessons.length == 0)
            throw ApiError.BadRequest(`No lessons for this division`)
        return lessons
    }
}

export default new LessonService()

enum LessonType {
    Lecture = 'lecture',
    Practice = 'practice',
    Lab = 'lab',
}

enum Repeat {
    Odd = 'odd',
    Even = 'even',
    All = 'all',
}