import {Markup} from "telegraf";
const jokes = [
    "Ріжемо русню!",
    "Русский военный корабль, иди нахуй!",
    "Цього бота тестував Віктор Кім",
    "Сьогодні Годовиченко провів 0 пар",
    "Де ж той блядський десант",
    "Слава Україні!",
    "Кажи, де зараз Степан Бендера?"
]

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