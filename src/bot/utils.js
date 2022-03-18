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
    let result = `Розклад ${divisionName}. ${_.capitalize(date.format('dddd D MMMM'))}`

    for(const lesson of lessons) {
        console.log(lesson)
        result += `\n\n${lesson.start} - ${lesson.end}\n`
        result += `${lesson.subject.name}`
    }
    return result
}