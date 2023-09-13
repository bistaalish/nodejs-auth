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



const handleLogin = (req,res) => {
    
}

module.exports  = {
    handleLogin,
    handleUserSignup
}