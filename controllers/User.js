const User = require('../models/User');
const PasswordReset = require('../models/passwordReset');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, UnauthenticatedError} = require('../errors/index');
const {sendVerificationEmail,sendResetPasswordEmail} = require('../misc/email');
const crypto = require('crypto');

/* 
User Registration and Authentication Controller
*/

const handleUserSignup = async (req,res) => {
    const {name,email,password} = req.body
    const verificationToken =  crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const user = await User.create({name,email,password,verificationToken:hashedToken})
    console.log(verificationToken)
    await sendVerificationEmail(email,verificationToken)
    const token = user.createJWT()
    const response = { user: {name: user.getName()}, token }
    res.status(StatusCodes.CREATED).json(response)    
}

const handlelogout = async (req,res) => {
  // This is a stateless API, so you don't need to invalidate tokens server-side.
  // Instead, simply instruct the client to discard the token.

  res.json({ message: 'Logged out successfully' });
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

const handleRefreshToken = async (req,res) => {
    // Generate new Token
    const user = await User.findById(req.user.userId)
    const newToken = user.createJWT()
    res.status(StatusCodes.OK).json({
        user: {
            name: user.getName()
        },
        token:newToken
    }) 
}

/* 
Password Reset and Email Management
*/

const verifyEmail = async (req,res) => {
    const token = req.params.token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOneAndUpdate({verificationToken: hashedToken},{
        isVerified: true,
        verificationToken: null
    })
    res.status(StatusCodes.OK).json({msg: "Email Verification True"})
}



const handleForgotPassword = async (req,res) => {
    const { email } = req.body;
    // Generate token
    const user = await User.findOne({email})
    if(!user){
        throw new NotFoundError("Email Not found")
    }
    const passwordReset = await PasswordReset.findOne({email})
    const resetToken = await crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 3600000)
    if(!passwordReset){
        await PasswordReset.create({
            email, token: hashedToken, expires
        })
        await sendResetPasswordEmail(email,resetToken)
        return res.status(StatusCodes.OK).json({ msg: 'Password reset Email sent.'}) 
    }
    passwordReset.token = resetToken
    passwordReset.expires = expires
    await passwordReset.save()
    await sendResetPasswordEmail(email,resetToken)
    return res.status(StatusCodes.OK).json({msg: 'Password Reset Email'})
    
}

const resetPassword = async (req,res) => {
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const { newPassword,verifyPassword } = req.body
    const resetToken = await PasswordReset.findOne({token:hashedToken})
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
    await PasswordReset.deleteOne({token:hashedToken})
    res.status(StatusCodes.OK).json({msg: "Password Reset successful"})

}

module.exports  = {
    handleLogin,
    handleUserSignup,
    verifyEmail,
    handleForgotPassword,
    resetPassword,
    handlelogout,
    handleRefreshToken
}