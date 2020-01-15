const {model, Schema } = require('mongoose')

// Mongooes Schema for User
const postUser = new Schema({
    userName: String,
    password: String,
    createdAt: String,
    email: String

})
module.exports = model('User', postUser)