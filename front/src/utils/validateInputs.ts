interface ValidateReturn {
    success: boolean 
    message?: string
}

export function validateEmail(email: string): ValidateReturn {    
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (email === "" || !regex.test(email)) {
        return {
            success: false,
            message: "Please provide a valid email."        
        }
    } 

    return {success: true}
}

export function validatePassword(password: string, confirmPwd: string): ValidateReturn {
    // Regex 6 characters, includes uppercase, lowercase, digit, and special char)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/

    if (password === "" || !regex.test(password)) {
        return {
          success: false,
          message: "Password must be at least 6 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character."        
        }
    } 

    if (password !== confirmPwd) {
        return {
            success: false,
            message: "The passwords do not match."        
        }
    }

    return {success: true}
    
}

export function validateUsername(username: string): ValidateReturn {
    const minLength = 3
    const maxLength = 20
    const regex = /^[a-zA-Z0-9_]+$/ // letters, numbers, and underscores only

    if (username === "") {
        return {
            success: false,
            message: 'Username is required.'
        }
    }

    if (username.length < minLength) {
        return {
            success: false,
            message: `Username must be at least ${minLength} characters long.`
        }
    }

    if (username.length > maxLength) {
        return {
            success: false,
            message: `Username must not exceed ${maxLength} characters.`
        }
    }

    if (!regex.test(username)) {
        return {
            success: false,
            message: 'Username can only contain letters, numbers, and underscores.'
        }
    }

    return { success: true }
}

export function validateDob(dob: string): ValidateReturn {
    if (!dob) {
        return {
            success: false,
            message: 'Date of birth, with the format YYYY-MM-DD, is required.'
        }
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/ //regex for YYYY-MM-DD
    if (!regex.test(dob)) {
        return {
            success: false,
            message: 'Date must be in the format YYYY-MM-DD only.'
        }
    }
  
    const date = new Date(dob)
    const now = new Date()
    if (isNaN(date.getTime())) {
        return {
            success: false,
            message: 'Invalid date format. Please use YYYY-MM-DD.'
        }
    }
  
    if (date > now) {
      return {
        success: false,
        message: 'Date of birth cannot be in the future.'
      }
    }
  
    // Could consider adding a minimum age for the website
  
    return { success: true }
}