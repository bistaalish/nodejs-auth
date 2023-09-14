const express = require('express');
const {verifyEmail} = require('../controllers/User');
const protectedRoutes = express.Router()

protectedRoutes.get("/profile",(req,res) => {
    res.json(req.user)
})

protectedRoutes.get('/verify/:token',verifyEmail)

module.exports = protectedRoutes