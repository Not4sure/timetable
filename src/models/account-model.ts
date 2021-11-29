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
        accessGroups: [{
            type: String,
            enum: ['lecturer', 'admin', 'superadmin']
        }],
        phoneNumber: {
            type: String,
            match: /^\+\d{10}$/,
        },
        // todo: rm _id from response
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
