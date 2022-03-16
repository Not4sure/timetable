import {Markup, Scenes} from 'telegraf'
import {getMainKeyboard} from "../utils";

const addAdmin = new Scenes.BaseScene('addAdmin')

addAdmin.enter(async ctx => {
    await ctx.reply(
        'Скинь мені повідомлення від нового адміна',
        Markup.keyboard([Markup.button.callback('Повернутися', 'back')])
    )
})

addAdmin.leave(async ctx => {
    await ctx.reply('Тут має бути рандомний жарт',
        getMainKeyboard(ctx.session.accessGroups))
})

addAdmin.hears('Повернутися', ctx => ctx.scene.leave())

addAdmin.on('text', ctx => ctx.scene.leave())

export default addAdmin