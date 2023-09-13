const express = require('express');
const protectedRoutes = express.Router()

protectedRoutes.get("/profile",(req,res) => {
    res.json(req.user)
})

module.exports = protectedRoutes