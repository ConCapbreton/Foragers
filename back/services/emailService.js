const { transporter, sender } = require('../config/nodemailerConfig')
const { WELCOME_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("../templates/emailTemplate")

const sendVerificationEmail = async (email, verificationToken) => {

    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Forgaers: Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        })

    } catch (error) {
        throw new Error(`Error sending email verfication email: ${error}`)
    }
}

const sendWelcomeEmail = async (email, username) => {

    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Foragers: Welcome!",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", username),
            // attachments: [{
            //     filename: //AS YOU WOULD EXPECT AS A STRING
            //     path: //AS YOU WOULD EXPECT AS A STRING
            //     cid: //UNIQUE EMAIL LIKE VALUE eg 'unique@openjavascript.info' in the HTML: <img src="cid:unique@openjavascript.info" alt="alt value" width="40" height="40" />
            //EXCLUDE THE CID IF YOU WANT THE FILE INCLUDED AS AN ATTACHEMENT
            // }]
        })
        
    } catch (error) {
        throw new Error(`Error sending welcome email: ${error}`)
    }
}

const sendPasswordResetEmail = async (email, resetURL) => { 
    
    try {

        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Foragers: Reset your password.",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        })

    } catch (error) {
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

const sendResetSuccessEmail = async (email) => {
   
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Foragers: Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        })

    } catch (error) {
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

module.exports = { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail }