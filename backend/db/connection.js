import { Sequelize } from "sequelize"
import  dotenv  from "dotenv"

dotenv.config()

const mysqlPass = process.env.MYSQL_PASS 

const sequelize = new Sequelize("petmatch", "root", mysqlPass, {
  host: "localhost",
  dialect: "mysql"
})

try {
  sequelize.authenticate()
  console.log("Conectamos com o Sequelize!")
} catch (error) {
  console.error("Não foi possível conectar:", error)
}

export default sequelize
