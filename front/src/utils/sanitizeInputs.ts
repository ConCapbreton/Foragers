export const containsHTML = (inputArray: any[]): {success: boolean, message?: string} => {
  const regex = /<[^>]*>/

  for (let i = 0; i < inputArray.length; i++) {
    if (typeof inputArray[i] === 'string' && regex.test(inputArray[i])) {
      return {
        success: false,
        message: "Unsupported formatting was detected. Please remove any code or tags."
      }    
    }
  }
    
  return {
    success: true,
  }    
}

export const safelyTrimInputs = (formData: Record<string, any>, fieldsToTrim: string[]) => {
  fieldsToTrim.forEach((field) => {
    if (typeof formData[field] === 'string') {
      formData[field] = formData[field].trim()
    }
  })
}