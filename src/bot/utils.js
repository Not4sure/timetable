import {Markup} from "telegraf";
const jokes = require('./jokes.json')

const userButtnos = [
    ['Сьогодні', 'Завтра'],
]
const adminButtons = []
const superAdminButtons = [
    ['Адміни', 'Додати адміна']
]

export function getMainKeyboard(accessGroups) {
    const buttons = [...userButtnos]
    if(accessGroups.includes('admin'))
        buttons.push(...adminButtons)
    if(accessGroups.includes('superadmin'))
        buttons.push(...superAdminButtons)

    return Markup.keyboard(buttons).resize()
}

export function randomJoke() {
    return jokes[Math.abs(Math.random() * jokes.length)]
}