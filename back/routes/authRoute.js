const express = require('express')
const { signup, verifyEmail, login, logout, forgotPassword, resetPassword, refresh } = require('../controllers/authController')
const { verifyToken } = require('../middleware/verifyToken')

const router = express.Router()

router.get('/refresh', verifyToken, refresh)

router.post('/signup', signup)
router.post('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

module.exports = router