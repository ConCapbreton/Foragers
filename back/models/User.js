const mongoose = require('mongoose')
//SOCIAL MEDIA DEVELOPMENT: profilePic, UserBio, userConnections [other user’s ids]. 
//COOKIE PREFERENCES?

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true, required logic handled by signup / googleOauth functions in authController
        unique: true,
        trim: true, 
        minlength: [3, 'Username must be at least 3 characters long'],  
        maxlength: [20, 'Username must be at most 20 characters long'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],  
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  
        trim: true,        
        // match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], rely on validator in signup or isVerified for Google users.  
    },
    dob: {
        type: String,
        // Not type: Date as this field will be encrypted.
        // required: true, required logic handled by signup / googleOauth functions in authController
    },
    password: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        index: true,
        unique: true,
        sparse: true, // Ensures the unique constraint is only enforced when this field actually exists
      },
    roles: {
        type: [String],
        enum: ['admin', 'user'],
        default: ['user'],
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    termsAccepted: {
        type: Boolean,
        default: false,
    },
    termsAcceptedAt: {
        type: Date
    },
    termsVersion: {
        type: String
    },
    completeProfileToken: String,
    completeProfileTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)