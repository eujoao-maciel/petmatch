import { DataTypes } from 'sequelize'

import db from '../db/connection.js'

const User = db.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
  }
)

export default User
