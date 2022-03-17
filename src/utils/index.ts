import moment from "moment";

const firstDay = moment(process.env.FIRST_DAY ?? '30/08/2021', 'DD/MM/YYYY')

const currentWeek = () => moment().diff(firstDay, 'weeks') + 1

function getWeekAndDay(date: moment.Moment) {
    const week = date.diff(firstDay, 'weeks') + 1
    const day = date.diff(firstDay, 'days') % 7 + 1
    return {week, day}
}

function getWeekNumber(weekInp: string) {
    let week: number
    switch (weekInp) {
        case 'current':
            week = currentWeek()
            break
        case 'next':
            week = currentWeek() + 1
            break
        default:
            week = Number(weekInp)
            break
    }
    return week
}

export {
    getWeekNumber,
    currentWeek,
    getWeekAndDay
}