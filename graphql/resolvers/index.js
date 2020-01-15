const userResolvers = require('./user.js')
const newsResolvers = require('./news.js') 
const adminResolvers = require('./admin.js')

//Combines all resolvers to one file so we can use em

module.exports = {

    // the power of modifiers i.e anything (mutation, query ) that return News will pass through this modifier
    // and we can modifiy the values 
    
    // News Modifier
    News : {
        likeCount : (parent) => parent.likes.length,
        commentCount : (parent) => parent.comments.length
    },

    // All queries
    Query : {...userResolvers.Query,
    ...newsResolvers.Query},

    // All Mutations
    Mutation : {
        ...userResolvers.Mutation,
        ...adminResolvers.Mutation
    }
    //All Subscriptions
    ,
    Subscription:{
        ...newsResolvers.Subscription
    }

}