import {Schema, model, Document} from 'mongoose'

const modelName = 'lesson'
export default model(modelName, getSchema())

// todo: заменить нормально
const timeLimits = {
    start: ['8:00', '9:50', '11:40', '13:30', '15:20', '17:10'],
    end: ['9:35', '11:25', '13:15', '15:05', '16:55', '18:45'],
}

function getSchema() {
    const schema = new Schema({
        subject: {type: Schema.Types.ObjectId, ref: 'subject'},
        lecturers: [{type: Schema.Types.ObjectId, ref: 'account'}],
        divisions: [{type: Schema.Types.ObjectId, ref: 'division'}],
        room: String,
        comment: String,
        link: String,
        type: {
            type: String,
            enum: ['lecture', 'practice', 'lab'],
        },
        repeat: {
            type: String,
            enum: ['odd', 'even', 'all', 'none'],
        },
        number: {
            type: Number,
            min: 1,
            max: 6,
        },
        day: {
            type: Number,
            min: 1,
            max: 7
        },
    });

    const params = {
        virtuals: true,
        versionKey: false,
        transform: (doc: any, ret: any) => {
            ret.start = timeLimits.start[doc.number - 1]
            ret.end = timeLimits.end[doc.number - 1]
            delete ret._id
        }
    }

    schema.set('toJSON', params)
    schema.set('toObject', params)

    return schema
}
