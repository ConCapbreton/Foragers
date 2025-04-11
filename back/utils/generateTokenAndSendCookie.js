const jwt = require('jsonwebtoken')

const generateTokenAndSendCookie = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_secret, {expiresIn: "7d"})

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 DAYS
    })

    return token
}

module.exports = {generateTokenAndSendCookie}
