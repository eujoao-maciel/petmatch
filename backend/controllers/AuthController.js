import User from "../models/User.js"
import bcrypt from "bcrypt"

export const register = async (req, res) => {
  const { name, email, password } = req.body

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

  const user = {
    name,
    email,
    password
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
