import {Context, Markup, Scenes} from 'telegraf'
import accountService from "../../services/account-service";

const admins = new Scenes.BaseScene('admins')

admins.enter(async ctx => {
    for(const account of await accountService.getByAccessGroup('admin'))
        await ctx.reply(
            `${account.telegramData.first_name} @${account.telegramData.username} ${account?.division?.name ?? 'Відраховано' }`,
            Markup.inlineKeyboard([
                Markup.button.callback('Зрада', JSON.stringify({action: "deleteFromAdmins", payload: account.telegramData.id}))
            ])
        )
    ctx.scene.leave()
})

admins.on('text', ctx => ctx.scene.leave())

export default admins