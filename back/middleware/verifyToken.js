const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({success: false, message: "Unauthorized"})
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) return res.status(401).json({success: false, message: "Unauthorized"})
        //req.userId = decoded.userId
        next()
    } catch (error) {
        console.log("Error in verifyToken", error)
        return res.status(500).json({success: false, message: "Server error"})
    }
}


// const verifyToken  = (req, res, next) => {
//     const authHeader = req.headers.authorization || req.headers.Authorization

//     if (!authHeader?.startsWith('Bearer ')) {
//         return res.status(401).json({success: false, message: "Unauthorized"})
//     }

//     const token = authHeader.split(' ')[1]

//     jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET,
//         (err, decoded) => {
//             if (err) return res.status(403).json({success: false, message: "Forbidden"})
//             req.user = decoded.UserInfo.username
//             req.roles = decoded.UserInfo.roles 
//             next()
//         }
//     )
// }

module.exports = { verifyToken }