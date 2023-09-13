const mongoose = require('mongoose');


var Schema = mongoose.Schema;

var UserSchema = new Schema({
        id: {
                type: String,
                default: null,
        },
        email: {
                type: String,
                required:[true,"email required"],
                unique: [true, "email already registered"]
        },
        firstName: String,
        lastName: String,
        profilePhoto: String,
        password: String,
        source: {
                type: String,
                required: [true,"source not specified"]
        },
        lastVisited: {
                type: Date,
                default: new Date(),
        },
        
},{
        timestamps: true
}
);
// Hash the user's password before saving it to the database
userSchema.pre('save', async function (next) {
        try {
          const user = this;
      
          // Only hash the password if it has been modified or is new
          if (!user.isModified('password')) return next();
      
          // Generate a salt
          const salt = await bcrypt.genSalt(10);
      
          // Hash the password with the salt
          const hashedPassword = await bcrypt.hash(user.password, salt);
      
          // Replace the plain password with the hashed password
          user.password = hashedPassword;
          return next();
        } catch (error) {
          return next(error);
        }
      });
      
      // Method to compare a candidate password with the hashed password in the database
      userSchema.methods.isValidPassword = async function (password) {
        try {
          return await bcrypt.compare(password, this.password);
        } catch (error) {
          throw new Error(error);
        }
      };
// Compile model from schema
module.exports = mongoose.model('Users', UserSchema );