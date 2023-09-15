/*
Authentication Routes:
POST /login -> Log in
POST /signup -> Sign up
POST /forgot-password -> Reset Password link
POST /forgot-password/:token -> Reset link 
GET /verify/:token -> verify user email
*/
const express = require('express');
const {handleLogin,handleUserSignup,handleForgotPassword,resetPassword,verifyEmail} = require('../controllers/User');
const router = express.Router();

router.post("/login",handleLogin)
router.post("/signup",handleUserSignup)
router.post("/forgot-password", handleForgotPassword)
router.post("/forgot-password/:token", resetPassword)
router.get('/verify/:token',verifyEmail)


module.exports = router