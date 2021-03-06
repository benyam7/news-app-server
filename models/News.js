const { model, Schema } = require('mongoose')


const newsSchema = new Schema({

    body: String,
    title: String,
    createdAt: String,
    userName: String,
    comments: [
        {
            userName: String, 
            body: String,
            createdAt: String,
        }
    ],
    likes: [
        {
            userName: String,
            createdAt: String
        }
    ],
    newsPhotoUrl: String,
    author: String,
    newsUrl: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})


// give it a name SportNews and export it
module.exports = model('News', newsSchema) 