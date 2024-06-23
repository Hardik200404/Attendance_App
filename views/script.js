function handle_submit(event){
    event.preventDefault()
    
    const date=event.target.date.value
    const div=document.getElementById('dynamic')
    
    //check attendance table based on the given date
    fetch('http://localhost:4000/?date='+date,{
        method: 'POST',
    }).then((response) => {
        if(response.ok){
            return response.json()
        }else{
            throw new Error('Error while fetching from DB using the given date')
        }
    }).then((res) => {
        //case 1-> attendance was not taken, then get all students
        if(res.length==0){
            div.innerHTML=''

            const new_ele=document.createElement('p')
            new_ele.appendChild(document.createTextNode(`For Date: ${date}`))
            div.appendChild(new_ele)

            const attendance_form=document.createElement('form')
            attendance_form.id='attend_form'

            //getting all the students, to mark attendance
            fetch('http://localhost:4000/students',{
                method: 'GET',
            }).then((response) => {
                if(response.ok){
                    return response.json()
                }else{
                    throw new Error('Error while fetching students')
                }
            }).then(students=>{
                //creating input feilds for these students
                for(let student of students){
                    const div = document.createElement('div')
                    div.classList.add('student')

                    const label = document.createElement('label')
                    label.textContent = student.name
                    label.htmlFor = 'present'

                    const presentCheckbox = document.createElement('input')
                    presentCheckbox.id = 'present'
                    presentCheckbox.type = 'checkbox'
                    presentCheckbox.name = student.name
                    presentCheckbox.value = 'present'

                    div.appendChild(label);
                    div.appendChild(presentCheckbox);
                    attendance_form.appendChild(div);
                    attendance_form.appendChild(document.createElement('br'))
                }
                const attendance_btn=document.createElement('button')
                attendance_btn.id='attend_submit'
                attendance_btn.type='submit'
                attendance_btn.innerHTML='Mark Attendance'
                attendance_form.appendChild(attendance_btn)
                div.appendChild(attendance_form)

                //submition of marked attendance
                attendance_form.onsubmit=function(){
                    const formData = new FormData(attendance_form)
                    const attendanceData = {}
                    students.forEach(student => {
                        attendanceData[student.name] = formData.has(student.name) ? true : false
                    });
                    //console.log('Attendance Data:', attendanceData)
                    
                    //insert the attendance data into DB
                    fetch('http://localhost:4000/submit-attendance/?date='+date, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(attendanceData)
                    })
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        console.log('Attendace for date:', data.date,' taken');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                    div.innerHTML='Attendance Taken'
                }
            }).catch(err=>{
                console.log(err)
            })
        
        }else{
            //case 2-> Attendance was taken, then get attendance report
            div.innerHTML='Attendance Already Taken'
            const date=res[0].date
            const new_ele=document.createElement('p')
            new_ele.appendChild(document.createTextNode(`For Date: ${date}`))
            div.appendChild(new_ele)

            for(let student of res){
                let new_ele=document.createElement('p')
                if(student.present){
                    new_ele.textContent=student.name + String.fromCodePoint(0x2705) + 'Present'
                }else{
                    new_ele.textContent=student.name + String.fromCodePoint(0x274E) + 'Absent'
                }
                div.appendChild(new_ele)
            }
        }
    })
    .catch((err) => console.log(err))
}

function fetch_full_attendance_report(){
    const div=document.getElementById('dynamic')
    
    fetch('http://localhost:4000/attendance',{
        method: 'GET',
    }).then(response=>response.json())
    .then(data=>{
        let report={}
        div.innerHTML=''
        for(let record of data){
            if (!report[record.name]) {
                report[record.name] = {
                    present: 0,
                    total: 0
                };
            }
            report[record.name].total++;
            if (record.present) {
                report[record.name].present++;
            }
        }
        //console.log(report)
        for(let [name,attendance] of Object.entries(report)){
            let new_div=document.createElement('div')
            let name_ele=document.createElement('p')
            let precentage=(attendance.present/attendance.total)*100
            precentage=precentage.toFixed(2)
            
            name_ele.textContent=name +' '+attendance.present+'/'+attendance.total+' '+precentage
            
            new_div.appendChild(name_ele)
            div.appendChild(new_div)
        }
    })
    .catch(err=>console.log(err))
}