import express from "express"
import bodyParser from "body-parser"
import {currentWeek} from "./utils";
import {Subject, Account, Division, Lesson} from './models'

const app = express()
const port = process.env.PORT
setTimeout(() => app.listen(port))

app.use(bodyParser.json())

app.post('/parseJSON', authUser, async (req, res) => {
    const data = req.body.data;
    try {
        for (const lesson of data) {
            const dvs = await Division.find({name: lesson.divisions})
            if (dvs.length == 0) continue;

            let divisions: any = [];
            for (const dv of dvs)
                divisions.push(dv._id)

            let lecturers: any = [];
            for (const name of lesson.lecturers) {
                let lecturer = await Account.findOne({firstname: name})
                if (!lecturer) {
                    lecturer = new Account;
                    lecturer.firstname = name;
                    lecturer = await lecturer.save();
                    console.log('lol', lecturer)
                }
                lecturers.push(lecturer._id);
            }

            let subject = await Subject.findOne({name: lesson.subject})
            if (!subject) {
                subject = new Subject;
                subject.name = lesson.subject;
                subject = await subject.save();
                console.log('lols', subject);
            }

            console.log(`subject ${subject._id} lecturers ${lecturers} divisions ${divisions}`)
            const ls = new Lesson
            ls.subject = subject._id
            ls.lecturers = lecturers
            ls.divisions = divisions
            ls.repeat = lesson.weeks
            ls.room = lesson.room
            ls.type = lesson.type
            ls.number = lesson.lesson_num
            ls.day = lesson.day
            await ls.save()
        }
        res.status(200).send('ok')
    } catch (e: any) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
})

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

app.post('/division', authUser, async (req, res) => {
    const data = req.body.data
    try {
        delete data._id
        const division = (new Division(data)).save()

        res.status(200).send(division)
    } catch (e: any) {
        res.status(400).send(e.message)
    }
})

app.post('/subject', authUser, async (req, res) => {
    const data = req.body.data
    try {
        delete data._id

        const subject = await (new Subject(data)).save()

        res.status(200).send(subject)
    } catch (e: any) {
        res.status(400).send(e.message)
    }
})

app.post('/account', authUser, async (req, res) => {
    const data = req.body.data
    try {
        let id = data._id
        delete data._id

        if(id) {
            await Account.findById(id).update(data)
        } else {
            id = (await (new Account(data)).save())._id
        }

        const account = await Account
            .findById(id)
            .populate('lecturerData')
            .populate('telegramData')
            .then()

        res.status(200).send(account)
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

//todo
function authUser(req: express.Request, res: express.Response, next: () => void) {
    const auth = req.body.tgUser
    if(auth == 'admin') {
        console.log('authorised')
        next()
    } else
        res.send(401).send({'error': 'Wrong tg token'})
}