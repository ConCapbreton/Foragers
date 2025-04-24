const User = require('../models/User')
const argon2 = require('argon2')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const validator = require('validator');
const { generateTokenAndSendCookie } = require('../utils/generateTokenAndSendCookie')
const { encrypt } = require('../utils/cryptoUtils')
const { validateHuman } = require('../services/validateHuman')
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../services/emailService')
const { generateAccessToken } = require('../utils/generateAccessToken')
const { getGoogleTokens, getGoogleUser } = require('../services/googleOauthService')

const signup = async (req, res) => {
    const {username, email, password, dob, termsAccepted, token } = req.body

    const isHuman = await validateHuman(token)

    if (!isHuman) {
        res.status(400).json({succes: false, message: "Failed ReCaptcha validation"})
        return
    }
    
    if (!username || !email || !password || !dob) {
        return res.status(400).json({success: false, message: "All fields are required."})
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({success: false, message: 'Please provide a valid email address.'});
    }

    if (!termsAccepted) {
        return res.status(403).json({success: false, message: "Please accept the Terms and conditions and Privacy Policy"})
    }

    try {
        
        const userAlreadyExists = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        }) 

        if (userAlreadyExists) {
            const duplicateField = userAlreadyExists.email === email ? "Email" : "Username"
            return res.status(400).json({success: false, message: `${duplicateField} already exists.`})
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedPwd = await argon2.hash(password)

        const user = new User({
            //roles, isVerified, isActive, lastLogin have default values in User model
            username,
            email,
            dob: encrypt(dob), 
            password: hashedPwd,
            termsAccepted,
            termsAcceptedAt: new Date(),
            termsVersion: process.env.TERMS_PRIVACY_VERSION,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        })

        await user.save()

        sendVerificationEmail(user.email, verificationToken)
        
        return res.status(201).json({success: true, message: "User created"})

    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
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
            return res.status(400).json({success: false, message: "Invalid or expired verification code."})
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()

        await sendWelcomeEmail(user.email, user.username)

        generateTokenAndSendCookie(res, user._id)
        accessToken = generateAccessToken(user.email)

        return res.status(200).json({
            success: true, 
            accessToken,         
            username: user.username,
        })

    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

const login = async (req, res) => {
    const { email, password, token } = req.body 
   
    try {

        const isHuman = await validateHuman(token)

        if (!isHuman) {
            res.status(400).json({succes: false, message: "Failed ReCaptcha validation"})
            return
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid credentials"})
        }
 
        // IF NOT VERIFIED: “If this email is associated with an account, a new verification link has been sent.”
        if (!user.isActive) {
            return res.status(403).json({success: false, message: "Your account is currently inactive. Please contact support."})
        }

        const isPasswordValid = await argon2.verify(user.password, password) 
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid credentials"})
        }

        user.lastLogin = new Date()
        await user.save()

        generateTokenAndSendCookie(res, user._id)
        const accessToken = generateAccessToken(user.email)

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken,         
            username: user.username
        })
        
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

const logout = async (_req, res) => {
    res.clearCookie("token")
    return res.status(200).json({success: true, message: "Logged out successfully"})
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

        return res.status(200).json({success: true, message: "Password reset link sent to your email"})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
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

        return res.status(200).json({success: true, message: "Password reset successful"})

    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
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

                return res.json({ success: true, username: foundUser.username, accessToken })
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
    
                return res.status(200).json({ success: true, message: "User logged in." })
            }
        )
    } catch (error) {
        return res.status(500).json({success: false, message: `There was an error: ${error.message}`})
    }
}

const googleOauth = async (req, res) => {
    const code = req.query.code

    try {
        const { access_token, id_token } = await getGoogleTokens(code)
        const googleUser = await getGoogleUser(access_token, id_token)

        // googleUser: {
        //     id: '100621013525456446598',
        //     email: 'connorsexton62@gmail.com',
        //     verified_email: true,
        //     name: 'Connor Sexton',
        //     given_name: 'Connor',
        //     family_name: 'Sexton',
        //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocK5d5alyykVlFoMRZnZglPDuhicD38ZBM-H6P8LsVLhbGfxlA=s96-c'
        //   }

        const existingUser = await User.findOne({ googleId: googleUser.id })
        
        //LOGIN
        if (existingUser && existingUser.isVerified) {
            
            if (!existingUser.isActive) {
                return res.status(403).json({success: false, message: "Your account is currently inactive. Please contact support."})
            }
        
            existingUser.lastLogin = new Date()
            await existingUser.save()

            
            generateTokenAndSendCookie(res, existingUser._id)
            //NO ACCESS TOKEN AS I AM RELYING ON REFRESH TOKEN AND REAUTH LOGIC

            return res.redirect(`${process.env.UI_ROOT_URI}/new-entry`)
        }

        // USER NEEDS TO COMPLETE PROFILE
        if (existingUser && !existingUser.isVerified) {
            const completeProfileToken = crypto.randomBytes(20).toString("hex")
            const completeProfileTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 //1 hour
            
            existingUser.completeProfileToken = completeProfileToken
            existingUser.completeProfileTokenExpiresAt = completeProfileTokenExpiresAt
            existingUser.save()

            return res.redirect(`${process.env.UI_ROOT_URI}/complete-google-signup/${completeProfileToken}`)
        }

        //GOOGLE EMAIL IS NOT VERIFIED
        if (!googleUser.verified_email) {
            return res.status(403).json({success: false, message: "Please ensure your email is verified with Google before signing up."})
        }

        //EMAIL ALREADY PRESENT ON ANOTHER ACCOUNT
        const existingEmail = await User.findOne({ email: googleUser.email })
        if (existingEmail && existingEmail.isVerified) {
            return res.status(403).json({success: false, message: "An account with this email already exists. Please log in."})
        }

        //FIRST TIME TRYING TO SIGNUP WITH GOOGLE
        const unbreakablePassword = Math.round().toString(36).slice(-8) + Math.round().toString(36).slice(-8)
        const hashedPwd = await argon2.hash(unbreakablePassword)
        const completeProfileToken = crypto.randomBytes(20).toString("hex") 
        const completeProfileTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 //1 hour

        const provisionalUserProfile = new User({
            // roles, isVerified, isActive, lastLogin have default values in User model
            // termsAccepted, username and dob fields will be updated in the next step
            // no need to verify email
            email: googleUser.email, 
            password: hashedPwd,
            googleId: googleUser.id,
            completeProfileToken, 
            completeProfileTokenExpiresAt
        })

        provisionalUserProfile.save()
        return res.redirect(`${process.env.UI_ROOT_URI}/complete-google-signup/${completeProfileToken}`)

    } catch (error) {
        
        return res.status(500).json({success: false, message: `There was an error: ${error.message}`})
    }
}

const completeProfile = async (req, res) => {
    const { username, dob, termsAccepted, completeProfileToken } = req.body
    
    if (!username || !dob) {
        return res.status(400).json({success: false, message: "All fields are required."})
    }

    if (!termsAccepted) {
        return res.status(403).json({success: false, message: "Please accept the Terms and conditions and Privacy Policy."})
    }

    if (!completeProfileToken) {
        return res.status(403).json({success: false, message: "There is an issue with your token, try and login again."})
    }

    try {
        const usernameAlreadyExists = await User.findOne({ username }) 

        if (usernameAlreadyExists) {
            return res.status(400).json({success: false, message: `Username already exists.`})
        }
    
        const incompleteUser = await User.findOne({ 
            completeProfileToken, 
            completeProfileTokenExpiresAt: { $gt: Date.now() }
        })
        
        if (!incompleteUser) {
            return res.status(400).json({success: false, message: "Invalid or expired token. Try and login again."})
        }

        incompleteUser.username = username
        incompleteUser.dob = encrypt(dob)
        incompleteUser.isVerified = true
        incompleteUser.termsAccepted = termsAccepted
        incompleteUser.termsAcceptedAt = new Date()
        incompleteUser.termsVersion = process.env.TERMS_PRIVACY_VERSION
        incompleteUser.completeProfileToken = undefined
        incompleteUser.completeProfileTokenExpiresAt = undefined
       
        await incompleteUser.save()

        generateTokenAndSendCookie(res, incompleteUser._id)
        const accessToken = generateAccessToken(incompleteUser.email)

        return res.status(200).json({
            success: true,
            message: "Profile updated and user logged in successfully",
            accessToken,         
            username: incompleteUser.username
        })

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
    isAuthenticated,
    googleOauth,
    completeProfile
}