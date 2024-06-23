const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const student_model = sequelize.define('students',{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
},{timestamps: false})

module.exports = student_model