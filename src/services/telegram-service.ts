import ApiError from '../exceptions/api-error'
import {TelegramLogin, TelegramLoginPayload} from 'node-telegram-login'

const tgToken = process.env.TG_TOKEN ?? ''
const tgLoginChecker = new TelegramLogin(tgToken)

class TelegramService {
    checkLoginData(data: TelegramLoginPayload) {
        return tgLoginChecker.checkLoginData(data)
    }

}

export default new TelegramService()