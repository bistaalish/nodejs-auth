const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, UnauthenticatedError} = require('../errors/index');
const {sendVerificationEmail} = require('../misc/email');



const handleUserSignup = async (req,res) => {
    const {name,email,password} = req.body
    const user = await User.create({name,email,password})
    const verificationToken = await user.getVerificationToken()
    console.log(verificationToken)
    await sendVerificationEmail(email,verificationToken)
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

const verifyEmail = async (req,res) => {
    const token = req.params.token
    const user = await User.findOneAndUpdate({verificationToken: token},{
        isVerified: true,
        verificationToken: null
    })
    res.status(StatusCodes.OK).json({msg: "Email Verification True"})
    // const token = req.params.token;
    // const user = await User.findOne({verificationToken: token});
    // if (!user) {
    //     throw NotFoundError("Verification Failed")
    // }
    // user.isVerified = true;
    // user.verificationToken = null;
    // await user.save();
    // res.json({ message: 'Email verification successful.' });
}

const handleChangePassword = async (req,res) =>{
    const id = req.user.userId
    const {currentPassword,newPassword,verificationPassword} = req.body
    if (!currentPassword || !newPassword || !verificationPassword ){
        throw new NotFoundError("Missing currentPassword or newPassword or verificationPassword")
    }
    if (newPassword !== verificationPassword) {
        throw new NotFoundError("newPassword and verificationPassword do not match")
    }
    const user = await User.findById(id)
    const isPasswordCorrect = await user.comparePassword(currentPassword)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Current Password")
    }
    user.password = newPassword;
    user.save()
    res.status(StatusCodes.CREATED).json({msg: "Password Changed Successfully"})
}

module.exports  = {
    handleLogin,
    handleUserSignup,
    verifyEmail,
    handleChangePassword
}