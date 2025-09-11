import { Router } from 'express'
import {
  register,
  login,
  getUserById,
  updateUser,
  getCurrentUser,
} from '../controllers/AuthController.js'

import checkAuth from '../utils/checkAuth.js'
import imageUpload from '../utils/imageUpload.js'

const router = Router()

router.put('/update/:id', checkAuth, imageUpload.single('image'), updateUser)
router.post('/register', register)
router.post('/login', login)
router.get('/profile', checkAuth, getCurrentUser)
router.get('/:id', getUserById)

export default router
