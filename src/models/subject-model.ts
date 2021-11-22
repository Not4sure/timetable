import {Schema, model} from 'mongoose'

const modelName = 'subject'
export default model(modelName, getSchema())

function getSchema() {
    const schema = new Schema({
        name: String
    });

    return schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id
        }
    });
}
