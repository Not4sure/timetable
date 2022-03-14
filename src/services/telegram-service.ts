import ApiError from '../exceptions/api-error'
import { TelegramLogin, TelegramLoginPayload } from 'node-telegram-login'
import {Context, Markup, Telegraf} from 'telegraf'
import accountService from "./account-service";

const tgToken = process.env.TG_TOKEN ?? ''
const tgLoginChecker = new TelegramLogin(tgToken)

const bot = new Telegraf(tgToken)
bot.telegram.setWebhook(`https://api.timetable.univera.app/${tgToken}`).then( _ => console.log('Webhook set'))

bot.use(async (ctx, next) => {
    // @ts-ignore
    const account = await accountService.login(ctx.from.id, ctx.from)
    if(!account.accessGroups.includes('superadmin'))
        await ctx.reply('Ти не суперадмін. Тобі тут не раді')
    else
        await next()
})

bot.start(ctx => {
    ctx.reply(
        'Ти - суперадмін. З великою силою з\'являється велике прискорення!',
        Markup.keyboard([[
                Markup.button.callback('Адміни', 'admins'),
                Markup.button.callback('Суперадміни', 'superadmins'),
            ],
            [Markup.button.callback('Додати', 'addAdmin', true)]
        ])
    )
})

bot.on('callback_query', ctx => {
    ctx.answerCbQuery()
})

class TelegramService {
    checkLoginData(data: TelegramLoginPayload) {
        return tgLoginChecker.checkLoginData(data)
    }
}

export const botCallback = bot.webhookCallback(`/${tgToken}`)

export default new TelegramService()