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
    id: user.id,
  })
}

export const getUserById = async (req, res) => {
  const id = req.params.id

  const user = await User.findOne({ where: { id: id } })

  if (!user) {
    res.status(404).json({
      error: {
        type: 'NotFound',
        message: 'User not found',
      },
    })
    return
  }

  res.status(200).json({ user })
}

export const updateUser = async (req, res) => {
  const { id } = req.params
  const { name, phone } = req.body

  let profileImage = ''
  if (req.file) {
    profileImage = req.file.filename
  }

  const reqUser = req.user
  const user = await User.findOne({ where: { id } })

  if (name) {
    user.name = name
  }

  if (phone) {
    user.phone = phone
  }

  if (profileImage) {
    user.profileImage = profileImage
  }

  try {
    await User.update(
      {
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      { where: { id: user.id } }
    )

    res.status(200).json({
      message: 'User updated successfully.',
      data: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    res.status(500).json({
      error: {
        type: 'Internal error',
        message: 'Internal server error: ' + err,
      },
    })
  }
}
