import {Markup} from "telegraf";

const userButtnos = [
    ['Сьогодні', 'Завтра'],
]
const adminButtons = []
const superAdminButtons = [
    ['Адміни', 'Додати адміна']
]

export function getMainKeyboard(accessGroups) {
    const buttons = userButtnos
    if(accessGroups.includes('admin'))
        buttons.push(...adminButtons)
    if(accessGroups.includes('superadmin'))
        buttons.push(...superAdminButtons)

    return Markup.keyboard(buttons).resize()
}
