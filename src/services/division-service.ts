import Division from '../models/division-model'
import ApiError from "../exceptions/api-error";
import Account from "../models/account-model";

class DivisionService {
    async getById(id: string) {
        console.log('id: ', id)
        const division = await Division.findById(id)
        if (!division)
            throw ApiError.BadRequest(`No division with such id`)
        return division
    }

    async getByName(name: string) {
        return await Division.findOne({name}).then()
    }

    async getAll() {
        const divisions = await Division.find().then()
        if (!divisions)
            throw ApiError.BadRequest(`Lol there's no divisions`)
        return divisions
    }

    // todo: по-нормальому сделть
    async create(data: any) {
        return await (new Division(data)).save()
    }

}

export default new DivisionService()