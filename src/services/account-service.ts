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
        return await Account.find({accessGroups: accessGroup})
            .populate('telegramData')
            .populate('division')
            .then()
    }

    async login(telegramId: number, telegramData?: any) {
        let account = await Account.findOne({ 'telegramData.id': telegramId }).then()
        if(!account)
            return await (new Account({ telegramData })).save()
        if(telegramData){
            account.telegramData = telegramData
            await account.save()
            return account
        }
    }

}

export default new AccountService()
