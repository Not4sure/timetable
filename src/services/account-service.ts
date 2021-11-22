import Account from '../models/account-model'
import ApiError from "../exceptions/api-error";

class AccountService {
    async get(id: string) {
        const account = await Account.findById(id)
        if (!account)
            throw ApiError.BadRequest(`No account with such id ${id}`)
        return account
    }

}

export default new AccountService()