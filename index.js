const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')



// relative imports 
const { MONGO_DB } = require('./config.js')
const typeDefs = require('./graphql/typeDefs.js')
const resolvers = require('./graphql/resolvers/index.js')

const pubsub = new PubSub();

const PORT = process.env.port || 8080

const server = new ApolloServer({
    typeDefs,    // es6: the same key n value name so metioning the key will do it
    resolvers,
    context : ({req}) => ({req, pubsub})    // forward the request (that contains the headers to context, so we can access it in resolvers)
}) 



mongoose.connect(MONGO_DB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected')
        return server.listen({ port: PORT })
    })
    .then(res => {
        console.log(`Server Running at ${res.url}`)
    })
    .catch(err => {
        console.error(err)
    })
