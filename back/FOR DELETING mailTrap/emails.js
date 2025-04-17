const { mailtrapClient, sender } = require("./mailtrapConfig")
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("../templates/emailTemplate")

const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Forgaers: Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email verification sent successfully", response)
    } catch (error) {
        console.error('Error sending verification email ', error)
        throw new Error(`Error sending email: ${error}`)
    }
}

const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "6859bdfc-6636-4e87-84c3-e664ed76c14e",
            template_variables: {
                "company_info_name": "Foragers",
                "name": name
            },
        })

        console.log("Welcome email sent successfully", response)
        
    } catch (error) {
        console.error('Error sending welcome email ', error)
        throw new Error(`Error sending welcome email: ${error}`)
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }]
    console.log(recipient)
    try { 
        const response = await mailtrapClient.send({
            from: sender,
            // to: recipient,
            //FOR DEV
            testInboxId: 3624896,
            to: [{ email: "your-sandbox-inbox@inbox.mailtrap.io" }],
            subject: "Foragers: Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })
        console.log("Password reset email sent successfully", response)
    } catch (error) {
        console.error('Error sending password reset email ', error)
        throw new Error(`Error sending password reset email: ${error}`)
    }

}

const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Foragers: Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset"
        })

        console.log("Password reset email sent successfully", response)
    } catch (error) {
        console.error('Error sending password reset email ', error)
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

module.exports = {
    sendVerificationEmail, 
    sendWelcomeEmail, 
    sendPasswordResetEmail,
    sendResetSuccessEmail
}