import ApiError from '../exceptions/api-error'
import { TelegramLogin, TelegramLoginPayload } from 'node-telegram-login'
import { Telegraf } from 'telegraf'

const tgToken = process.env.TG_TOKEN ?? ''
const tgLoginChecker = new TelegramLogin(tgToken)

const bot = new Telegraf(tgToken)
bot.telegram.setWebhook(`https://api.timetable.univera.app/${tgToken}`).then( _ => console.log('Webhook set'))

bot.command('start', (ctx) => {
    ctx.reply('Поки що я нічого не вмію.')
})

class TelegramService {
    checkLoginData(data: TelegramLoginPayload) {
        return tgLoginChecker.checkLoginData(data)
    }



}

export const botCallback = bot.webhookCallback(tgToken)

export default new TelegramService()