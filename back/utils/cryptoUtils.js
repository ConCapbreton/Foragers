const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const iv = crypto.randomBytes(16) // Initialization vector

const encrypt = (text) => {
  const secretKey = process.env.ENCRYPTION_KEY // Must be 32 bytes

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}`
}

const decrypt = (encryptedText) => {
  const secretKey = process.env.ENCRYPTION_KEY // Must be 32 bytes

  const [ivHex, encrypted] = encryptedText.split(':')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(ivHex, 'hex'))
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = { encrypt, decrypt }