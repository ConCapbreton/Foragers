const mongoose = require('mongoose')
//SOCIAL MEDIA DEVELOPMENT: profilePic, UserBio, userConnections [other user’s ids]. 
//COOKIE PREFERENCES?

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        minlength: [3, 'Username must be at least 3 characters long'],  
        maxlength: [20, 'Username must be at most 20 characters long'],  
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  
        trim: true,        
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], 
    },
    dob: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
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
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)