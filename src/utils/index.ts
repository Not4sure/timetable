import moment from "moment";

const firstDay = moment(process.env.FIRST_DAY ?? '01/09/2021', 'DD/MM/YYYY')

const currentWeek = () => moment().diff(firstDay, 'weeks') + 1

export {
    currentWeek
}