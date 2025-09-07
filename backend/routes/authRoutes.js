import { Router } from 'express'
import {
  register,
  login,
  getUserById,
  updateUser,
} from '../controllers/AuthController.js'

import checkAuth from '../utils/checkAuth.js'

const router = Router()

router.post('/update/:id', checkAuth, updateUser)
router.post('/register', register)
router.post('/login', login)
router.get('/:id', getUserById)

export default router
