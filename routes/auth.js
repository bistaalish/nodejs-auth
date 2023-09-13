const express = require('express');
const {handleLogin,handleUserSignup} = require('../controllers/User');

const router = express.Router();

router.post("/login",handleLogin)
router.post("/signup",handleUserSignup)

module.exports = router