const  {gql} = require('apollo-server')

//TYPE DEFNITIONS

module.exports = gql` 
    #News Type
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
    #Comment Type
    type Comment {
        id: ID!
        createdAt: String!
        body: String!
        userName: String!
    }
    #Like / Views Type
    type Like {
        id: ID!
        createdAt: String!
        userName: String!
    }
    # Query types
    type Query {
       getNews: [News]
       getSingleNews(newsId : String) : News
    }
    #User type
    type User {
        id: ID!
        email: String!
        userName: String!
        createdAt: String!
        token: String!
    }

    #Custom UserInput type for registration
    input RegisterUserInput {

        userName: String!
        email: String!
        password: String!
        confirmPassword: String!
     
        
    } 
    #Mutation types
    type Mutation {
        registerUser(registerUserInput: RegisterUserInput) : User!
        login(userName: String!, password: String!): User!
        postNews(newsTitle: String!, newsBody: String!, newsPhotoUrl: String!) : News!
        deleteNews(newsId: ID!) : String!
        deleteComment(newsId: ID!, commentId: ID!) : News!
        likeNews(newsId: ID!) : News!
        createComment(newsId: ID!, body: String) : News!
    }
    #Subscription types
    type Subscription{
        newNews: News! #to notify everytime new post is posted
    }
`