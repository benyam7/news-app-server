

const News = require('../../models/News')

module.exports = {

    Query: {
        // the reason why we used async await syntax is, if our query fails by chance our server wont stop,
        // but if we did not used it, the server will break
        async getNews(){
            try{
                const news = await News.find().sort({ createdAt : -1 }) // this sorts by createdAt and -1 mean in descending order
                return news
            } catch(err){
                throw new Error(err)
            }
        },

        async getSingleNews(_, {newsId}){
            try{
                const singleNews = await News.findById(newsId)

                if(singleNews){
                    return singleNews
                }else{  
                    throw new Error("News Not found")
                }
            }catch(e){
                throw new Error(e)
            }
        }
        ,
     

        
    },
    Subscription:{
        newNews: {
            subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW_NEWS') 
        }
    }
    
   

}