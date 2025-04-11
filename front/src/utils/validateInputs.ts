export function validateEmail(email: string) {    
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (email === "" || !regex.test(email)) {
        return {
            success: false,
            message: "Please provide a valid email."        
        }
    } else {
        return {success: true}
    }
}

export function validatePassword(password: string): { success: boolean; message?: string } {
    // Regex pattern for a valid password (at least 6 characters, includes uppercase, lowercase, digit, and special char)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/

    if (password === "" || !regex.test(password)) {
        return {
          success: false,
          message: "Password must be at least 6 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character."        
        }
    } else {
        return {success: true}
    }
}