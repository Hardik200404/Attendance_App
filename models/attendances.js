const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const attendance_model = sequelize.define('attendances',{
    date:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    present:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},{timestamps: false})

module.exports = attendance_model