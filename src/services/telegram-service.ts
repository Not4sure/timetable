import ApiError from '../exceptions/api-error'
import { TelegramLogin, TelegramLoginPayload } from 'node-telegram-login'
import { Telegraf } from 'telegraf'
import accountService from "./account-service";

const tgToken = process.env.TG_TOKEN ?? ''
const tgLoginChecker = new TelegramLogin(tgToken)

const bot = new Telegraf(tgToken)
bot.telegram.setWebhook(`https://api.timetable.univera.app/${tgToken}`).then( _ => console.log('Webhook set'))

bot.start(async (ctx) => {
    const account = await accountService.login(ctx.from.id, ctx.from)
    if(!account.accessGroups.includes('superadmin'))
        return ctx.reply('Ти не суперадмін. Тобі тут не раді')
    return ctx.reply('Привіт')
})

class TelegramService {
    checkLoginData(data: TelegramLoginPayload) {
        return tgLoginChecker.checkLoginData(data)
    }



}

export const botCallback = bot.webhookCallback(`/${tgToken}`)

export default new TelegramService()