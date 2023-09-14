const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication Invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token,process.env.SECRET_KEY)
        // attach the users to the jov routes
        req.user = {userId: payload.userId, name: payload.name,isVerified:payload.isVerified}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid')
    }
}

module.exports = authMiddleware;