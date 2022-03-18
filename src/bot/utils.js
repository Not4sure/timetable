import {Markup} from "telegraf";
import lessonService from "../services/lesson-service";
import {getWeekAndDay} from "../utils";
import divisionService from "../services/division-service";
import moment from "moment";
import "moment/locale/uk";

const jokes = [
    "Ріжемо русню!",
    "Русский военный корабль, иди нахуй!",
    "Сьогодні Годовиченко провів 0 пар",
    "Де ж той блядський десант",
    "Слава Україні!",
    "Кажи, де зараз Степан Бендера"
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
    if(accessGroups) {
        if(accessGroups.includes('admin'))
            buttons.push(...adminButtons)
        if(accessGroups.includes('superadmin'))
            buttons.push(...superAdminButtons)
    }

    return Markup.keyboard(buttons).resize()
}

export function randomJoke() {
    return jokes[Math.floor(Math.random() * jokes.length)]
}

export async function getLessons(divisionId, date) {
    const divisionName = (await divisionService.getById(divisionId))?.name
    const lessons = lessonService.getByDate(divisionId, date)

    date.locale('uk')
    return 'test'
    return `Сьогодні ${date.format('dddd')}`

    if(lessons.length === 0) {
        return `Сьогодні ${date.format('dddd')}`
    }

    const result = `Розклад `
    for(const lesson in lessons) {

    }

}