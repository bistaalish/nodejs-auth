const {NotFoundError} = require('../errors');
const User = require('../models/User');

/* 
    User Profile Management
*/

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

module.exports = {
    handleChangePassword
}