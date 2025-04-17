const User = require('../models/User')
const argon2 = require('argon2')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { generateTokenAndSendCookie } = require('../utils/generateTokenAndSendCookie')
// const { validateHuman } = require('../services/validateHuman')
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../services/emailService')
const { generateAccessToken } = require('../utils/generateAccessToken')


const signup = async (req, res) => {
    const {email, password, username} = req.body
    //USER MODEL: 
    // username, email, dob, password, roles, lastLogin, isVerified, isActive, termsAccepted, termsAcceptedAt, termsVersion


    try {
        if (!email || !password || !username) {
            //BETTER TO res.status().json() here so that you can provide the correct res status
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await User.findOne({email}) 
        if (userAlreadyExists) {
            return res.status(400).json({success: false, message: "User already exists"})
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const hashedPwd = await argon2.hash(password)

        const user = new User({
            email,
            password: hashedPwd,
            username,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        })

        await user.save()

        sendVerificationEmail(user.email, verificationToken)
        
        res.status(201).json({success: true, message: "User created", username})

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

const verifyEmail = async (req, res) => {
    const { code } = req.body
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()

        await sendWelcomeEmail(user.email, user.username)

        generateTokenAndSendCookie(res, user._id)
        accessToken = generateAccessToken(user.email)

        //GOING TO LOG IN THE USER IMMEDIATELY
        res.status(200).json({
            success: true, 
            message: "Email verified", 
            accessToken,         
            user: {
                username: user.username
            }
        })

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

const login = async (req, res) => {
    const { email, password } = req.body //ADD BACK IN TOKEN
   
    try {

        // const isHuman = await validateHuman(token)

        //FOR DEV RECAPTCHA IS DISACTIVATED
        // if (!isHuman) {
        //     res.status(400).json({succes: false, message: "Failed ReCaptcha validation"})
        //     return
        // }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid credentials"})
        }

        //LOGIC HERE FOR isActive / isVerified? 

        const isPasswordValid = await argon2.verify(user.password, password) 
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid credentials"})
        }

        user.lastLogin = new Date()
        await user.save()

        generateTokenAndSendCookie(res, user._id)
        const accessToken = generateAccessToken(user.email)

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken,         
            username: user.username
        })
        
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

const logout = async (_req, res) => {
    res.clearCookie("token")
    res.status(200).json({success: true, message: "Logged out successfully"})
} 

const forgotPassword = async (req, res) => {
    const { email } = req.body
    
    try {
        const user = await User.findOne({ email })
        

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found"})
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 //1 hour

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt
        
        await user.save()
        
        await sendPasswordResetEmail(user.email, `${process.env.RESET_PASS_LINK}${resetToken}`)

        res.status(200).json({success: true, message: "Password reset link sent to your email"})
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now()}
        })

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired reset token"})
        }

        const hashedPwd = await argon2.hash(password)

        user.password = hashedPwd
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()

        await sendResetSuccessEmail(user.email)

        res.status(200).json({success: true, message: "Password reset successful"})

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

const refresh = async (req, res) => {
    try {
        
        const cookies = req.cookies

        if (!cookies?.token) return res.status(401).json({success: false, message: 'Unauthorized'})
        
        const refreshToken = cookies.token

        jwt.verify(
            refreshToken,
            process.env.JWT_SECRET, 
            async (err, decoded) => {
                if (err) return res.status(403).json({success: false, message: 'Forbidden'}) 
                
                const foundUser = await User.findById(decoded.userId)

                if (!foundUser) return res.status(401).json({success: false, message: "Unauthorized"})

                const accessToken = generateAccessToken(foundUser.email)

                res.json({ success: true, user: foundUser.username, accessToken })
            }
        )
    } catch (error) {
        return res.status(500).json({success: false, message: `There was an error: ${error.message}`})
    }
}

const isAuthenticated = async (req, res) => {
    
    try {
        const cookies = req.cookies
    
        if (!cookies?.token) return res.status(200).json({success: false, message: 'User needs to login.'})
        
        const refreshToken = cookies.token
    
        jwt.verify(
            refreshToken,
            process.env.JWT_SECRET, 
            async (err, decoded) => {
                if (err) {
                    res.clearCookie("token")
                    return res.status(200).json({success: false, message: 'User needs to login.'}) 
                }
                const foundUser = await User.findById(decoded.userId)
    
                if (!foundUser) {
                    res.clearCookie("token")
                    return res.status(200).json({success: false, message: 'User needs to login.'}) 
                }
    
                res.json({ success: true, message: "User logged in." })
            }
        )
    } catch (error) {
        return res.status(500).json({success: false, message: `There was an error: ${error.message}`})
    }
}

module.exports = {
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refresh,
    isAuthenticated
}