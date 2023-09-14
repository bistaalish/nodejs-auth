const express = require('express');
const {handleLogin,handleUserSignup,handleForgotPassword,resetPassword} = require('../controllers/User');

const router = express.Router();

router.post("/login",handleLogin)
router.post("/signup",handleUserSignup)
router.post("/forgot-password", handleForgotPassword)
router.post("/forgot-password/:token",resetPassword)

module.exports = router