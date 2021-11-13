import mongoose from '../lib/initMongo'
import {basename} from 'path'

const Schema = mongoose.Schema
const modelName = basename(__filename, '.js')
const schema = getSchema()
export default mongoose.model(modelName, schema)

export enum LessonType {
    Lecture = 'lecture',
    Practice = 'practice',
    Lab = 'lab',
}

export enum Repeat {
    Odd = 'odd',
    Even = 'even',
    All = 'all',
}

/**
 * Model Schema definition
 * @returns {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
export function getSchema() {
    return new Schema({
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
        //todo
        begin: {
            type: Date,

        }
    });
}
