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
            [Markup.button.callback('Додати', 'addAdmin')]
        ])
    )
})

bot.on('text', async ctx => {
    switch (ctx.message.text) {
        case 'Адміни':
            for(const account of await accountService.getByAccessGroup('admin'))
                ctx.reply(
                    `${account.telegramData.first_name} @${account.telegramData.username} ${account.division.name}`,
                    Markup.inlineKeyboard([
                        Markup.button.callback('Зрада', JSON.stringify({action: "deleteFromAdmins", payload: account.telegramData.id}))
                    ])
                )
            break;
        case 'Суперадміни':
            for(const account of await accountService.getByAccessGroup('superadmin'))
                ctx.reply(`${account.telegramData.first_name} @${account.telegramData.username} ${account.division.name}`)
            break;
        case 'Додати':
            ctx.reply('Скидай повідомлення нового адміна!')
            break;
        default:
            console.log(ctx.updateType)
            console.log(ctx.message)
    }
})

bot.action(/deleteFromAdmins/,async ctx => {
    const id = JSON.parse((ctx.callbackQuery as any).data).payload
    const account = await accountService.login(id)
    account.accessGroups = account.accessGroups.filter((group: string) => group !== 'admin')
    await account.save()
    ctx.reply('Одним адміном менше!')
})

class TelegramService {
    checkLoginData(data: TelegramLoginPayload) {
        return tgLoginChecker.checkLoginData(data)
    }
}

export const botCallback = bot.webhookCallback(`/${tgToken}`)

export default new TelegramService()