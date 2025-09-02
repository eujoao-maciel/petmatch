import User from '../models/User.js'
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js'

export const register = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body

  if (!name) {
    res.status(400).json({
      error: {
        type: 'ValidationError',
        message: 'The name field is required.',
      },
    })
    return
  }

  if (!email) {
    res.status(400).json({
      error: {
        type: 'ValidationError',
        message: 'The email field is required.',
      },
    })
    return
  }

  if (!password) {
    res.status(400).json({
      error: {
        type: 'ValidationError',
        message: 'The password field is required.',
      },
    })
    return
  }

  if (password !== confirmpassword) {
    res.status(400).json({
      error: {
        type: 'ValidationError',
        message: 'Password and confirm password do not match.',
      },
    })
    return
  }

  const userAlreadyExists = await User.findOne({ where: { email } })

  if (userAlreadyExists) {
    res.status(409).json({
      error: {
        type: 'Conflict',
        message: 'Email is already in use.',
      },
    })
    return
  }

  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = {
    name,
    email,
    password: passwordHash,
  }

  try {
    const newUser = await User.create(user)
    res.status(201).json({
      message: 'User created successfully.',
      data: { id: newUser.id, name: newUser.name, email: newUser.email },
      token: generateToken(newUser.id),
    })
  } catch (error) {
    console.log(error)
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    res.status(400).json({
      error: {
        type: 'ValidationError',
        message: 'The email field is required.',
      },
    })
    return
  }

  if (!password) {
    res.status(400).json({
      error: {
        type: 'ValidationError',
        message: 'The password field is required.',
      },
    })
    return
  }

  const user = await User.findOne({ where: { email: email } })

  if (!user) {
    res.status(404).json({
      error: {
        type: 'NotFound',
        message: 'User not found',
      },
    })
    return
  }

  const checkPassword = await bcrypt.compare(password, user.password)

  if (!checkPassword) {
    res.status(401).json({
      error: {
        type: 'Unauthorized',
        message: 'Invalid password',
      },
    })
    return
  }

  res.status(200).json({
    token: generateToken(user.id),
    id: user.id
  })
}
