const  {gql} = require('apollo-server')

module.exports = gql` 
    type News{
        id: ID!
        body: String!
        title: String!
        # admin: String!
        comments: [Comment]!
        createdAt: String!
        likes: [Like]!
        userName: String!
        likeCount: Int!
        commentCount: Int!
        newsPhotoUrl: String!


    }

    type Comment {
        id: ID!
        createdAt: String!
        body: String!
        userName: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        userName: String!
    }

    type Query {
       getNews: [News]
       getSingleNews(newsId : String) : News
    }
    type User {
        id: ID!
        email: String!
        userName: String!
        createdAt: String!
        token: String!
    }
    input RegisterUserInput {

        userName: String!
        email: String!
        password: String!
        confirmPassword: String!
     
        
    } 

    type Mutation {
        registerUser(registerUserInput: RegisterUserInput) : User!
        login(userName: String!, password: String!): User!
        postNews(newsTitle: String!, newsBody: String!, newsPhotoUrl: String!) : News!
        deleteNews(newsId: ID!) : String!
        deleteComment(newsId: ID!, commentId: ID!) : News!
        likeNews(newsId: ID!) : News!
        createComment(newsId: ID!, body: String) : News!
    }

    type Subscription{
        newNews: News! #to notify everytime new post is posted
    }
`