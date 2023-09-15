const express = require('express');
const {handleChangePassword} = require('../controllers/Profile');
const protectedRoutes = express.Router()

protectedRoutes.get("/",(req,res) => {
    res.json(req.user)
})

protectedRoutes.post('/change-password',handleChangePassword)



module.exports = protectedRoutes