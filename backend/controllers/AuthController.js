import User from "../models/User.js"
import bcrypt from "bcrypt"

export const register = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body

  if (!name) {
    res.status(400).json({
      error: {
        type: "ValidationError",
        message: "The name field is required."
      }
    })
    return
  }

  if (!email) {
    res.status(400).json({
      error: {
        type: "ValidationError",
        message: "The email field is required."
      }
    })
    return
  }

  if (!password) {
    res.status(400).json({
      error: {
        type: "ValidationError",
        message: "The password field is required."
      }
    })
    return
  }

  if (password !== confirmpassword) {
    res.status(400).json({
      error: {
        type: "ValidationError",
        message: "Password and confirm password do not match."
      }
    })
    return
  }

  const userAlreadyExists = await User.findOne({ where: { email } })

  if (userAlreadyExists) {
    res.status(409).json({
      error: {
        type: "Conflict",
        message: "Email is already in use."
      }
    })
    return
  }

  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = {
    name,
    email,
    password: passwordHash
  }

  try {
    const newUser = await User.create(user)
    res.status(201).json({
      message: "User created successfully.",
      data: { id: newUser.id, name: newUser.name, email: newUser.email }
    })
  } catch (error) {
    console.log(error)
  }
}

