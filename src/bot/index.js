import {Telegraf, Scenes} from 'telegraf'
import accountService from '../services/account-service'
import startScene from './scenes/start'
import addAdmin from './scenes/addAdmin'
import admins from './scenes/admins'
import LocalSession from 'telegraf-session-local'
import {getLessons, getMainKeyboard} from "./utils";
import moment from "moment";

const tgToken = process.env.TG_TOKEN ?? ''

const bot = new Telegraf(tgToken)
bot.telegram.setWebhook(`https://api.timetable.univera.app/${tgToken}`).then( _ => console.log('Webhook set'))

const parseParams = { parse_mode: "MarkdownV2" }

const stage = new Scenes.Stage([
    startScene,
    addAdmin,
    admins
])

bot.use((new LocalSession({storage: LocalSession.storageMemory})))
bot.use(getUserInfo)
// bot.use(isSuperAdmin)
bot.use(stage.middleware())

async function getUserInfo(ctx, next) {
    if(!ctx.session.accountId) {
        const account = await accountService.login(ctx.from.id, ctx.from)
        ctx.session.accessGroups = account.accessGroups
        ctx.session.accountId = account.id
        ctx.session.division = account.division
    }
    await next()
}

async function isSuperAdmin(ctx, next) {
    if(!ctx.session.accessGroups.includes('superadmin'))
        await ctx.reply('Ти не суперадмін. Тобі тут не раді')
    else
        await next()
}

bot.start(ctx => !ctx.session.division ? ctx.scene.enter('start') : ctx.reply(`Привіт, ${ctx.from.first_name}`, getMainKeyboard(ctx.session.accessGroups)))
bot.hears('Адміни', isSuperAdmin, ctx => ctx.scene.enter('admins'))
bot.hears('Суперадміни', isSuperAdmin, ctx => ctx.reply('А хуй, мене харило писати цю частину'))
bot.hears('Додати адміна', isSuperAdmin, ctx => ctx.scene.enter('addAdmin'))
bot.hears('Сьогодні', async ctx => ctx.reply(await getLessons(ctx.session.division, moment()), parseParams))
bot.hears('Завтра', async ctx => ctx.reply(await getLessons(ctx.session.division, moment().add(1, 'days')), parseParams))

bot.action(/deleteFromAdmins/,async ctx => {
    const id = JSON.parse(ctx.callbackQuery.data).payload
    const account = await accountService.login(id)
    account.accessGroups = account.accessGroups.filter(group => group !== 'admin')
    await account.save()
    ctx.reply('Одним адміном менше!')
})

export const botCallback = bot.webhookCallback(`/${tgToken}`)