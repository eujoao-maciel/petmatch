import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()
const jwtSecret = process.env.MYSECRET

const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log(authHeader.split(' ')[1])
  console.log(jwtSecret)
  if (!authHeader) {
    res.status(401).json({
      error: {
        type: 'AuthenticationError',
        message: 'Access denied: token not provided.',
      },
    })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.user = await User.findOne({ where: { id: decoded.id } })
    next()
  } catch (err) {
    return res.status(401).json({
      error: {
        type: 'AuthenticationError',
        message: 'Access denied: token not provided.',
      },
    })
  }
}

export default checkAuth
