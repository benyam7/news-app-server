const {model, Schema } = require('mongoose')

const userSchema = new Schema({
    userName: String,
    password: String,
    createdAt: String,
    email: String

})
module.exports = model('User', userSchema)