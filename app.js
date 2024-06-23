const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const student_model = require('./models/students')
const attendance_model = require('./models/attendances')
const sequelize = require('./util/database')

app.get('/',(req,res)=>{
    res.json({message:"Hello"})
})

//to check the attendance table for a given date
app.post('/',(req,res)=>{
    let date=req.query.date
    attendance_model.findAll({
        where:{
            date:date
        }})
    .then(attendances=>{
        res.send(attendances)
    }).catch(err=>{
        console.log(err)
    })
})

//get all the students
app.get('/students',(req,res)=>{
    student_model.findAll()
    .then(students=>{
        res.send(students)
    }).catch(err=>{
        console.log(err)
    })
})

//get all the attendance
app.get('/attendance',(req,res)=>{
    attendance_model.findAll()
    .then(attendances=>{
        res.send(attendances)
    }).catch(err=>{
        console.log(err)
    })
})

//submit attendance report
app.post('/submit-attendance',(req,res)=>{
    let date=req.query.date
    let bulk_data=[]
    for(let [student,present] of Object.entries(req.body)){
        bulk_data.push({
            "date":date,
            "name":student,
            "present":present
        })
    }
    attendance_model.bulkCreate(bulk_data)
    .then(result=>{
        res.status(201).send({"date":date})
    }).catch(err=>{
        console.log(err)
    })
})

sequelize.sync()
.then(result => {
    app.listen(4000)
    console.log("Synced with DB and app runing on port: ",4000)
}).catch(err => console.log(err))