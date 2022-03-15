import {Context, Markup, Scenes} from 'telegraf'
import {getMainKeyboard} from "../utils";

const start = new Scenes.BaseScene('start')

start.enter(async ctx => {
    ctx.reply('Тут може бути якесь питання. Але його тут немає.')
})

start.leave(ctx => {
    ctx.reply(
        'Ти - суперадмін. З великою силою з\'являється велике прискорення!',
        getMainKeyboard(ctx.session.accessGroups)
    )
})

start.on('text', ctx => ctx.scene.leave())

export default start