const jwt = require('jsonwebtoken')
const { encodingKey } = require('../config')
const { AuthenticationError } = require('apollo-server')

// Checks if the user is Authorized or not
module.exports = (context) => {

    const authHeader = context.req.headers.authorization;

    if(authHeader){
        // if there is auth header
        // by convention authHeader is writen as "Bearer token"
        const token = authHeader.split('Bearer ')[1] // split n get the token

        if(token){
            try{
                const admin = jwt.verify(token, encodingKey)    // verify if the token exist n sent in convetional format
                return admin
            }catch(err){
                throw new AuthenticationError('Token verification failed')
            }
        } 
        // if token is not in right format
        throw new Error("Token is not in a format 'Bearer token' ")
    } 
    // if no authHeader
    throw new Error("No Authrization Header Provided")


}