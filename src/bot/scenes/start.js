import {Context, Markup, Scenes} from 'telegraf'
import {getMainKeyboard, randomJoke} from "../utils";
import divisionService from "../../services/division-service";
import accountService from "../../services/account-service";

const start = new Scenes.BaseScene('start')

start.leave(ctx => {
    ctx.reply(randomJoke(), getMainKeyboard(ctx.session.accessGroups))
})

start.enter(async ctx => {
    await ctx.reply('Обери свою группу.',
        Markup.keyboard((await divisionService.getAll()).map(group => group.name), {columns: 3}))
})

start.on('text', async ctx => {
    const division = await divisionService.getByName(ctx.message.text)

    if(!division)
        return ctx.reply('Такої групи немає')

    const account = await accountService.get(ctx.session.accountId)
    account.division = division
    await account.save()
    await ctx.scene.leave()
})

export default start