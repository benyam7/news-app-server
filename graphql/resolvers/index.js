const userResolvers = require('./user.js')
const newsResolvers = require('./news.js') 
const adminResolvers = require('./admin.js')

module.exports = {

    // the power of modifiers i.e anything (mutation, query ) that return News will pass through this modifier
    // and we can modifiy the values 
    News : {
        likeCount : (parent) => parent.likes.length,
        commentCount : (parent) => parent.comments.length
    },

    Query : {...userResolvers.Query,
    ...newsResolvers.Query},

    Mutation : {
        ...userResolvers.Mutation,
        ...adminResolvers.Mutation
    }
    ,
    Subscription:{
        ...newsResolvers.Subscription
    }

}