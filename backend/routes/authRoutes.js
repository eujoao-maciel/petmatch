import { Router } from "express"
import { register, login, getUserById } from "../controllers/AuthController.js"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/:id", getUserById)

export default router
