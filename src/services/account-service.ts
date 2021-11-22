import Account from '../models/account-model'
import ApiError from "../exceptions/api-error";

class AccountService {
    async get(id: string) {
        const account = await Account.findById(id)
        if (!account)
            throw ApiError.BadRequest(`No account with such id ${id}`)
        return account
    }

    // todo: по-нормальому сделть
    async create(data: any) {
        return await (new Account(data)).save()
    }

}

export default new AccountService()