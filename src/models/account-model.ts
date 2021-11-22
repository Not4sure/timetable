import {Schema, model} from 'mongoose'

const modelName = 'account'
export default model(modelName, getSchema())

function getSchema() {
    const schema = new Schema({
        firstname: String,
        lastname: String,
        patronymic: String,
        mail: String,
        division: {type: Schema.Types.ObjectId, ref: 'division'},
        phoneNumber: {
            type: String,
            math: /^\+\d{10}$/,
        },
        lecturerData: new Schema({
           position: String,
        }),
        telegramData: new Schema({
            id: Number,
            first_name: String,
            last_name: String,
            username: String,
            photo_url: String,
        }),
    });

    return schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id
        }
    });
}
