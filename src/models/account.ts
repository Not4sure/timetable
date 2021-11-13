import mongoose from '../lib/initMongo'
import {basename} from 'path'

const Schema = mongoose.Schema
const modelName = basename(__filename, '.js')
const schema = getSchema()
export default mongoose.model(modelName, schema)

/**
 * Model Schema definition
 * @returns {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
export function getSchema() {
    return new Schema({
        firstname: String,
        lastname: String,
        patronymic: String,
        division: {type: Schema.Types.ObjectId, ref: 'division'},
        phoneNumber: {
            type: String,
            math: /^\+\d{10}$/,
        },
        lecturerData: new Schema({
           degree: String,
        }),
        telegramData: new Schema({
            id: Number,
            first_name: String,
            last_name: String,
            username: String,
            photo_url: String,
        }),
    });
}
