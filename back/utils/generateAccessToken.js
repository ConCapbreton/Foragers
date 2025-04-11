const jwt = require('jsonwebtoken')

const generateAccessToken = (email) => {
    const accessToken = jwt.sign(
        {
            userEmail: email
            // "UserInfo": {
            //     "username": foundUser.username,
            //     "roles": foundUser.roles,
            // }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' } //IN PRODUCTION SET THIS TO 15 minutes
    )
    return accessToken
}

module.exports = { generateAccessToken }
