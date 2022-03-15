import {Context, Markup, Scenes} from 'telegraf'
import accountService from "../../services/account-service";

const admins = new Scenes.BaseScene('start')

admins.enter(async ctx => {
    for(const account of await accountService.getByAccessGroup('admin'))
        ctx.reply(
            `${account.telegramData.first_name} @${account.telegramData.username} ${account?.division.name}`,
            Markup.inlineKeyboard([
                Markup.button.callback('Зрада', JSON.stringify({action: "deleteFromAdmins", payload: account.telegramData.id}))
            ])
        )
})

admins.leave(ctx => {
    ctx.reply(
        'Ти - суперадмін. З великою силою з\'являється велике прискорення!',
        Markup.keyboard([[
            Markup.button.callback('Адміни', 'adminsList'),
            Markup.button.callback('Суперадміни', 'superAdminsList'),
        ],
            [Markup.button.callback('Додати', 'addAdmin')]
        ])
    )
})

admins.on('text', ctx => ctx.scene.leave())

export default admins