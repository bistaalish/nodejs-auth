const mongoose = require('mongoose');


var Schema = mongoose.Schema;
var passwordResetSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        expires: {
            type: Date, 
            required:true}
});
// Compile model from schema
module.exports = mongoose.model('PasswordReset', passwordResetSchema );