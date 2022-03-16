import {Markup, Scenes} from 'telegraf'
import {getMainKeyboard} from '../utils'
import divisionService from "../../services/division-service";
import accountService from "../../services/account-service";

const addAdmin = new Scenes.BaseScene('addAdmin')

addAdmin.enter(async ctx => {
    await ctx.reply(
        'Скинь мені повідомлення від нового адміна',
        Markup.keyboard([Markup.button.callback('Повернутися', 'back')])
    )
})

addAdmin.leave(async ctx => {
    delete ctx.session.quiz
    await ctx.reply('Тут має бути рандомний жарт',
        getMainKeyboard(ctx.session.accessGroups))
})

addAdmin.hears('Повернутися', ctx => ctx.scene.leave())

addAdmin.on('text',async ctx => {
    const message = ctx.message
    if(message.forward_sender_name) {
        ctx.reply('Закритий чєл, скритний')
         return ctx.scene.leave()
    } else if(message.forward_from) {
        ctx.session.quiz = {forward_from: message.forward_from}
         return ctx.reply('А тепер введи группу, наприклад УІ191')
    }

    if (!ctx.session.quiz?.forward_from)
        return ctx.reply('Спочатку перешли повідомлення')

    const division = await divisionService.getByName(message.text)

    if(!division)
        return ctx.reply('Такої групи немає')

    const account = await accountService.login(ctx.session.quiz.forward_from.id, ctx.session.quiz.forward_from)
    account.division = division
    account.accessGroups.push('admin')
    await account.save()
    ctx.reply('Перемога!')

    return ctx.scene.leave()
})

export default addAdmin