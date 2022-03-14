import Account from '../models/account-model'
import ApiError from '../exceptions/api-error'

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

    async getByAccessGroup(accessGroup: string) {
        let accounts = await Account.find({accessGroup: accessGroup}).then()
        console.log(accounts)
        return accounts
    }

    async login(telegramId: number, telegramData: any) {
        let account = await Account.findOne({ 'telegramData.id': telegramId }).then()
        if(!account)
            account = await (new Account({ telegramData })).save()
        return account
    }

}

export default new AccountService()
