const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors/index');

const handleUserSignup = async (req,res) => {
    const {name,email,password} = req.body
    const user = await User.create({name,email,password})
    const token = user.createJWT()
    const response = { user: {name: user.getName()}, token }
    res.status(StatusCodes.CREATED).json(response)    
}



const handleLogin = async (req,res) => {
    const {email,password} = req.body
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }
    const user = await User.findOne({email})
    // if user does not exists
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    // Compare password
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({
        user: {
            name: user.getName()
        },
        token
    }) 

}


module.exports  = {
    handleLogin,
    handleUserSignup
}