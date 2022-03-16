import {Context, Markup, Scenes} from 'telegraf'
import {getMainKeyboard, randomJoke} from "../utils";
import divisionService from "../../services/division-service";
import accountService from "../../services/account-service";

const start = new Scenes.BaseScene('start')

start.enter(async ctx => {
    if(ctx.session.division) {
        await ctx.reply(`Привіт, ${ctx.from.first_name}`)
        return await ctx.scene.leave()
    }

    await ctx.reply('Привіт! Для початку, обери свою группу.',
        Markup.keyboard((await divisionService.getAll()).map(group => group.name), {columns: 3}))
})

start.leave(ctx => {
    ctx.reply(randomJoke(), getMainKeyboard(ctx.session.accessGroups))
})

start.on('text', async ctx => {
    const division = await divisionService.getByName(message.text)

    if(!division)
        return ctx.reply('Такої групи немає')

    const account = await accountService.get(ctx.session.accountId)
    account.division = division
    await account.save()
    ctx.scene.leave()
})

export default start