const validateHuman = async (token) => {
    const secret = process.env.RECAPTCHA_SECRET_KEY
    if (!secret || !token) {
        throw new Error('Missing reCAPTCHA secret key or token')
    }

    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: secret,
                response: token,
            }),
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to verify reCAPTCHA');
        }

        return data.success

    } catch (error) {
        throw new Error(`Error during reCAPTCHA verification: ${error.message}`);
    }
}

module.exports = { validateHuman }