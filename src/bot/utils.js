import {Markup} from "telegraf";
import "moment/locale/uk";
import _ from 'lodash'
import lessonService from "../services/lesson-service";
import divisionService from "../services/division-service";

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
    const lessons = await lessonService.getByDate(divisionId, date)

    date.locale('uk')

    let result = `Розклад ${divisionName}. ${_.capitalize(date.format('dddd, D MMMM'))}\n`

    for(let lesson of lessons) {
        lesson = lesson.toObject()
        result += `\n<b>${lesson.start} - ${lesson.end}</b>\n`
        result += `<a href="${lesson.link}">${lesson.subject.name}</a>\n`
        for (const l of lesson.lecturers)
            result += `${l.firstname} ${l.lastname}\n`
    }

    return result
}