const {model, Schema } = require('mongoose')

const postUser = new Schema({
    userName: String,
    password: String,
    createdAt: String,
    email: String

})
module.exports = model('User', postUser)