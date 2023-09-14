const express = require('express');
const {verifyEmail,handleChangePassword} = require('../controllers/User');
const protectedRoutes = express.Router()

protectedRoutes.get("/profile",(req,res) => {
    res.json(req.user)
})

protectedRoutes.post('/change-password',handleChangePassword)


protectedRoutes.get('/verify/:token',verifyEmail)

module.exports = protectedRoutes