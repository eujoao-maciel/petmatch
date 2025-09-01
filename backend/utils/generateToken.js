import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const jwtSecret = process.env.MYSECRET

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: '7d' })
}

export default generateToken