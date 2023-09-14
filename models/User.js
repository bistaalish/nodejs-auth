const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email"
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true,"Please provide password"],
        minlength: 6,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
});

// hash password using bcrypt
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.verificationToken =  crypto.randomBytes(32).toString('hex')
    this.password = await bcrypt.hash(this.password, salt)
  })

// Create JSON web token
UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {userId: this._id, name: this.name},
        process.env.SECRET_KEY,{
            expiresIn: process.env.JWT_LIFETIME
        }
    )
}

// get Name
UserSchema.methods.getName = function () {
    return this.name
}

// Compare password
UserSchema.methods.comparePassword = async function (pass) {
    const isMatch = await bcrypt.compare(pass,this.password)
    return isMatch
}

// Generate verificationToken
UserSchema.methods.getVerificationToken = async function () {
    return this.verificationToken
}
// Compile model from schema
module.exports = mongoose.model('Users', UserSchema );