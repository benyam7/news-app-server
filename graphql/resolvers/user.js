const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { UserInputError, AuthenticationError } = require('apollo-server') 

const User = require('../../models/User')
const {encodingKey} = require('../../config')
const {validateUserData, validateLoginInput} = require('../../util/validators')
const doAuth = require('../../util/auth')
const News = require('../../models/News')
// token generator
const generateToken = (user) =>  {
     return jwt.sign({
        // here we list things we wanna encode
        id: user.id, 
        email: user.email,
        userName: user.userName,

    }, encodingKey, { expiresIn: '1h'} )

    
}

module.exports = {

    Mutation : {
    
        async login(_, {userName, password }){
            // import the login validator and destructure it, for userName n password
            const {errors, valid }  = validateLoginInput(userName, password)

            // check for valid info
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }
            // check if the user exists
            const user = await User.findOne({userName})
            if(!user){
                errors.userNotFound = "User not found"
                throw new UserInputError('User not found', {errors})

                }
            // check if passwords match 
            const match = await bcrypt.compare(password, user.password)

            if (!match){
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', {errors})

            }
            // generate token
            const token =  generateToken(user)
            // retun, user
          //  console.log(token)
            return {
                ...user._doc,
                id: user._id,
                token
            }
   
        },

        async registerUser(_, {registerUserInput: {userName, password, confirmPassword, email }}, context, info ){
            //validate user data


            const {valid, errors } = validateUserData(userName, password, confirmPassword, email)
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }
            // makesure user is new
            
            const user = await User.findOne({userName}) // look if userName exists already in collection
            console.log(user)
            if(user){   
                // used specific appolo error to help us debuging later 
                throw new UserInputError('User name already taken',{
                errors: {
                   userName: 'This Username is taken'
                }
            }) 
        }
            // hash the password and create auth token
            
            password = await bcrypt.hash(password, 12); // hash the password using 12 rounds, n by default bycryp is asychronous

            const  newUser = new User({
                email,
                userName,
                password,
                createdAt: new Date().toISOString() // this converts the date to string
            })
            // console.log(newUser)
            
            const res = await newUser.save(); // we saved it and assinged the returned result to res

           const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id, 
                token
            }
        },

        // using () => 

        createComment: async (_, { newsId, body }, context ) => {
            const admin = doAuth(context) // for some reason, when decoding the token we're getting all the keys in lowwercase
           console.log(admin)
            if(body.trim() === ''){
                throw new UserInputError('Empty comment', {
                    errors : {
                        body: 'comment must not be empty'
                    }
                })
            }

            const news = await News.findById(newsId)
            // check if the news exist 
            if(news){
                console.log(news.comments)
                news.comments.unshift({
                    body,
                    userName: admin.userName,   // for some reason, when decoding the token we're getting all the keys in lowwercase
                    createdAt: new Date().toISOString()
                })

                // save 
                await news.save();
                return news;
            } else throw new UserInputError('News not found')
        },

        async deleteComment(_, {commentId, newsId }, context){
            const {userName} = doAuth(context)
            console.log(doAuth(context))

            const news = await News.findById(newsId)
            console.log(news.userName)

            if(news){
                console.log(news.comment)
                const commentIndex =  news.comments.findIndex(comment => commentId === comment.id)
                console.log(commentIndex)
                if(news.comments[commentIndex].userName === userName){
                    news.comments.splice(commentIndex, 1)
                    await news.save()
                    
                    return news
                }else{
                    throw new AuthenticationError ("Operation denied")
                }
            }else{
                throw new UserInputError("News Not found")
            }
           
        },

        likeNews : async (_, {newsId}, context ) => {

            const {userName} = doAuth(context)

            const news = await News.findById(newsId)

            if(news){
                // check if already liked
                if(news.likes.find(like => like.userName === userName)){
                  news.likes =  news.likes.filter(like => like.userName !== userName)
                }else{
                    news.likes.push({
                        userName,
                        createdAt : new Date().toISOString()
                    })
                }
                await news.save()
                return news

            }else{
                throw new UserInputError("News not found")
            }

        }
    }
}