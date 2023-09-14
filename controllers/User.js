const User = require('../models/User');
const PasswordReset = require('../models/passwordReset');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, UnauthenticatedError} = require('../errors/index');
const {sendVerificationEmail,sendResetPasswordEmail} = require('../misc/email');
const { v4: uuidv4 } = require('uuid');



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

const handleForgotPassword = async (req,res) => {
    const { email } = req.body;
    // Generate token
    const user = await User.findOne({email})
    if(!user){
        throw new NotFoundError("Email Not found")
    }
    const passwordReset = await PasswordReset.findOne({email})
    const resetToken = await uuidv4()
    const expires = new Date(Date.now() + 3600000)
    if(!passwordReset){
        await PasswordReset.create({
            email, token: resetToken, expires
        })
        await sendResetPasswordEmail(email,resetToken)
        return res.status(StatusCodes.OK).json({ msg: 'Password reset Email sent.'}) 
    }
    passwordReset.token = resetToken
    passwordReset.expires = expires
    await passwordReset.save()
    return res.status(StatusCodes.OK).json({msg: 'Password Reset Email'})
    
}

const resetPassword = async (req,res) => {
    const {token} = req.params;
    const { newPassword,verifyPassword } = req.body
    const resetToken = await PasswordReset.findOne({token})
    if(!resetToken || resetToken.expires < Date.now()){
        throw new NotFoundError("Invalid or expired token")
    }
    if(!newPassword || !verifyPassword ) {
        throw new NotFoundError("newPassword or verifyPassword are missing")
    }
    if(newPassword !== verifyPassword){
        throw new NotFoundError("newPassword and verifyPassword do not match")
    }
    const user = await User.findOne({email:resetToken.email})
    user.password = newPassword
    await user.save()
    await PasswordReset.deleteOne({token})
    res.status(StatusCodes.OK).json({msg: "Password Reset successful"})

}

module.exports  = {
    handleLogin,
    handleUserSignup,
    verifyEmail,
    handleChangePassword,
    handleForgotPassword,
    resetPassword
}