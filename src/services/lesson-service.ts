import Lesson from '../models/lesson-model'
import Division from '../models/division-model'
import Subject from '../models/subject-model'
import Account from '../models/account-model'
import ApiError from "../exceptions/api-error";

class LessonService {
    async getById(id: string) {
        const lesson = await Lesson
            .findById(id)
            .populate('subject')
            .populate('lecturers')
            .populate('divisions')
            .then()
        if (!lesson)
            throw ApiError.BadRequest(`No lesson with such id`)
        return lesson
    }

    async getByDivision(divisionId: string, week?: number) {
        const repeat = week ? (week % 2 ? ['odd', 'all'] : ['even', 'all']) : ['odd', 'even', 'all']
        console.log(repeat, divisionId)
        const lessons = await Lesson
            .find({divisions: divisionId, repeat: repeat})
            .populate('subject')
            .populate('lecturers')
            .populate('divisions')
            .then()
        if (lessons.length == 0)
            throw ApiError.BadRequest(`No lessons for this division`)
        return lessons
    }

    async edit(id, data) {
        const lesson = await Lesson.findById(id).then()
        if(!lesson)
            throw ApiError.BadRequest('No such lesson')
        await lesson.update(data).then()
        
        return lesson
    }

    // todo: rm
    async createFromJSON(data: any) {
        try {
            for (const lesson of data) {
                const dvs = await Division.find({name: lesson.divisions})
                if (dvs.length == 0) continue;

                let divisions: any = [];
                for (const dv of dvs)
                    divisions.push(dv._id)

                let lecturers: any = [];
                for (const l of lesson.lecturers) {
                    let lecturer = await Account.findOne({
                        lastname: l.lastname,
                        firstname: { "$regex": l.n, "$options": "i" },
                        patronymic: { "$regex": l.p, "$options": "i" },
                    })
                    if (!lecturer) {
                        lecturer = new Account;
                        lecturer.firstname = l.n;
                        lecturer.patronymic = l.p;
                        lecturer.lastname = l.lastname;
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
        } catch (e: any) {
            console.log(e.message)
        }
    }
}

export default new LessonService()

enum LessonType {
    Lecture = 'lecture',
    Practice = 'practice',
    Lab = 'lab',
}

enum Repeat {
    Odd = 'odd',
    Even = 'even',
    All = 'all',
}
