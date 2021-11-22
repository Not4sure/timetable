import Subject from '../models/subject-model'
import ApiError from "../exceptions/api-error";

class SubjectService {
    async get(id: string) {
        const subject = await Subject.findById(id)
        if (!subject)
            throw ApiError.BadRequest(`No subject with such id ${id}`)
        return subject
    }

}

export default new SubjectService()