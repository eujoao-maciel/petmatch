import express from "express"
import authRouter from "./routes/authRoutes.js"
import cors from "cors"

import connection from "./db/connection.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/auth", authRouter)

try {
  await connection.sync()
  console.log("conectado ao banco")
} catch (error) {
  console.log("não foi possivel conectar ao banco")
}

export default app
