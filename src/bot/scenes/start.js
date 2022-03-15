import {Context, Markup, Scenes} from 'telegraf'

const start = new Scenes.BaseScene('start')

start.enter(async ctx => {
    ctx.reply('Тут може бути якесь питання. Але його тут немає.')
})

start.leave(ctx => {
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

start.on('text', ctx => ctx.scene.leave())

export default start