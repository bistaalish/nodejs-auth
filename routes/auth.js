/*
Authentication Routes:
POST /login -> Log in
POST /signup -> Sign up
POST /forgot-password -> Reset Password link
POST /forgot-password/:token -> Reset link 
GET /verify/:token -> verify user email
*/
const express = require('express');
const authMiddleware = require('../middlewares/authentication');

const {handleLogin,
    handleUserSignup,
    handleForgotPassword,
    resetPassword,
    verifyEmail,
    handlelogout,
    handleRefreshToken
} = require('../controllers/User');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Create a rate limiter middleware for 5 requests per day
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours (1 day)
    max: 5, // Allow 5 requests per day
    message: 'Too many password reset requests from this IP today, please try again tomorrow.',
  });

router.post("/login",handleLogin)
router.post("/logout",handlelogout)
router.post("/register",handleUserSignup)
router.post("/forgot-password", limiter ,handleForgotPassword)
router.post("/forgot-password/:token", resetPassword)
router.get('/verify/:token',verifyEmail)
router.post("/refresh-token",authMiddleware,handleRefreshToken)



module.exports = router