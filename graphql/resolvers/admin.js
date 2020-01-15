const doAuth = require('../../util/auth')
const News = require('../../models/News') 
const { AuthenticationError } = require('apollo-server')

// Mutations for Admin user 
module.exports = {
    Mutation: {

        // posts news
        async postNews(_, { newsTitle, newsBody, newsPhotoUrl } , context){
            // since positing is an authorized operation we need to check if it is comming from authorized path and jwt verification
            // we did that in separate file called auth

            const admin = doAuth(context);
            console.log(admin)

            if(newsTitle.trim() === ''){
                throw new Error("News Title must not be empty", {
                    error: "News Title must not be empty"
                })
                
            }
            if(newsBody.trim() === ''){
                throw new Error('News Body cannot be empty',
                 {   error : "News Body cannot be empty"}
                )
            }
            // here the admin is authorized
            // create news with the model
            const newNews = new News({
                title: newsTitle,
                body: newsBody,
                createdAt: new Date().toISOString(),
                // admin,
                newsPhotoUrl,
                likes: [],
                comments: [],
                user: admin.id, 
                userName: admin.userName
                
            });

            const news = await newNews.save();
            // here we subscribed for "NEW_NEWS" and sent the pay load of "news"
            context.pubsub.publish('NEW_NEWS', {
                newNews: news
            })
            return news;

        },

        // Deletes News
        async deleteNews(_, { newsId }, context){

            const admin = doAuth(context) // the authorization will be done here
            console.log(admin)
            // here it has passed the authorization
            try{

                // try to make the post created by one admin not to be deleted by other 
                
            const news = await News.findById(newsId)
            console.log(news)
            if(admin.userName === news.userName){
                await news.delete();
                return "Deletion succesful"
            } else{
                throw new AuthenticationError('Operation Denied')
            }
            } catch(err){
                throw new Error(err)
            }
        }

    }
}