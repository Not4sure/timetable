import {Markup, session, Telegraf, Scenes} from 'telegraf'
import accountService from '../services/account-service'
import startScene from './scenes/start'
import LocalSession from 'telegraf-session-local'

const tgToken = process.env.TG_TOKEN ?? ''

const bot = new Telegraf(tgToken)
bot.telegram.setWebhook(`https://api.timetable.univera.app/${tgToken}`).then( _ => console.log('Webhook set'))

const stage = new Scenes.Stage([
    startScene,
])

bot.use((new LocalSession({storage: LocalSession.storageMemory})))
bot.use(getUserInfo)
bot.use(isSuperAdmin)
bot.use(stage.middleware())

async function getUserInfo(ctx, next) {
    console.log('ctx.session', ctx.session)
    if(!ctx.session?.accessGroups) {
        const account = await accountService.login(ctx.from.id, ctx.from)
        ctx.session.accessGroups = account.accessGroups
    }
    await next()
}

async function isSuperAdmin(ctx, next) {
    if(!ctx.session.accessGroups.includes('superadmin'))
        await ctx.reply('Ти не суперадмін. Тобі тут не раді')
    else
        await next()
}

bot.start(ctx => ctx.scene.enter('start'))


bot.on('text', async ctx => {
    switch (ctx.message.text) {
        case 'Адміни':
            for(const account of await accountService.getByAccessGroup('admin'))
                ctx.reply(
                    `${account.telegramData.first_name} @${account.telegramData.username} ${account?.division.name}`,
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
            if(ctx.message.forward_from_name)
                ctx.reply('Я хз що з цим робити, в нього аккаунт скритий!')
            else {
                const acc = await accountService.login(ctx.message.forward_from.id, ctx.message.forward_from)
                acc.accessGroups.push('admin')
                await acc.save()
            }
    }
})

bot.action(/deleteFromAdmins/,async ctx => {
    const id = JSON.parse(ctx.callbackQuery.data).payload
    const account = await accountService.login(id)
    account.accessGroups = account.accessGroups.filter(group => group !== 'admin')
    await account.save()
    ctx.reply('Одним адміном менше!')
})

export const botCallback = bot.webhookCallback(`/${tgToken}`)