import express from "express"
import bodyParser from "body-parser"
import {currentWeek} from "./utils";
import {Subject, Account, Division, Lesson, Repeat, LessonType} from './models'

const app = express()
const port = process.env.PORT
setTimeout(() => app.listen(port))

app.use(bodyParser.json())

app.post('/lesson', authUser, async (req, res) => {
    const data = req.body.data
    try {
        let id = data._id
        delete data._id

        if(id) {
            await Lesson.findById(id).update(data)
        } else {
            id = (await (new Lesson(data)).save())._id
        }

        const lesson = await Lesson
            .findById(id)
            .populate('subject')
            .populate('lecturers')
            .populate('divisions')
            .then()

        res.status(200).send(lesson)
    } catch (e: any) {
        res.status(400).send(e.message)
    }
})

app.get('/lessons/:divisionId/:week', async (req, res) => {
    const {divisionId, week: weekInp} = req.params
    let week
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
    const repeats = ['all', week % 2 ? 'odd' : 'even']

    try {
        const lessons = await Lesson
            .find({divisions: divisionId, repeat: repeats})
            .populate('subject')
            .populate('lecturers')
            .populate('divisions')
            .then()

        res.status(200).send(lessons)
    } catch (e: any) {
        console.log(e.message)
        res.status(400).send()
    }
})

app.get('/lessons/:divisionId', async (req, res) => {
    const {divisionId} = req.params

    try {
        const lessons = await Lesson
            .find({divisions: divisionId})
            .populate('subject')
            .populate('lecturers')
            .populate('divisions')
            .then()

        res.status(200).send(lessons)
    } catch (e: any) {
        console.log(e.message)
        res.status(400).send()
    }
})

app.get('/lesson/:id', async (req, res) => {
    const id = req.params.id

    try {
        const lesson = await Lesson
            .findById(id)
            .populate('subject')
            .populate('lecturers')
            .populate('divisions')
            .then()

        res.status(200).send(lesson)
    } catch (e: any) {
        console.log(e.message)
        res.status(400).send()
    }
})

app.get('/', async (req, res) => {
    const lecturer = await (new Account({
        firstname: 'Mykola',
        lastname: 'Hodowitcher',
        lecturerData: {degree: 'doctor'},
    })).save()
    const division = await (new Division({name: 'UI191', course: 3})).save()
    const subject = await (new Subject({name: 'OOP'})).save()
    const lesson = await new Lesson({
        subject: subject._id,
        divisions: [division._id],
        lecturers: [lecturer._id],
        type: LessonType.Lecture,
        comment: 'Перенесем на стрим',
        link: 'google.com',
        weeks: Repeat.Odd,
        number: 1,
        day: 1
    }).save()
    console.log(lesson)

    res.send('Hello World')
})

//todo
function authUser(req: express.Request, res: express.Response, next: () => void) {
    const auth = req.body.tgUser
    if(auth == 'admin') {
        console.log('authorised')
        next()
    } else
        res.send(401).send({'error': 'Wrong tg token'})
}