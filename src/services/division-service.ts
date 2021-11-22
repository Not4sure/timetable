import Division from '../models/division-model'
import ApiError from "../exceptions/api-error";

class DivisionService {
    async getById(id: string) {
        const division = await Division.findById(id)
        if (!division)
            throw ApiError.BadRequest(`No division with such id`)
        return division
    }

    async getAll() {
        const divisions = await Division.find()
        if (!divisions)
            throw ApiError.BadRequest(`Lol there's no divisions`)
        return divisions
    }

}

export default new DivisionService()