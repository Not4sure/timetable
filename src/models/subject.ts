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
        name: String
    });
}
