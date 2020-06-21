

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Editor from './../my_node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor'



// const serverURL = `http://127.0.0.1:8080`
const serverURL = `https://whispering-sea-27389.herokuapp.com`



let theEditor
Editor
.create( document.querySelector( '#editor' )
    , {
        // SimpleUploadAdapter has been manually added to built-in plugins.
        simpleUpload: {
            // The URL that the images are uploaded to.
            uploadUrl: `${serverURL}/simpleUploadAdapter`,

        }
    }
)
.then( editor => theEditor = editor)
.catch( error => {
    console.error( error );
} );







// func.js

let token


const dashboard = response => {



    token = response.token
    // console.log(token, 'dashboard')
    document.querySelector('#loader').classList.add('d-none')
    document.querySelector('#logoutForm').classList.remove('d-none')
    document.querySelector('#userName').classList.remove('d-none')

    // console.log(response, 'response at dashboard')

    if(response.todaysTasks) {
        let date = response.todaysTasks.date.replace("_",", ").replace("_"," ").replace("_"," ")
        document.querySelectorAll('.date').forEach(dateCol => dateCol.innerHTML = `<h3><strong>${date}</strong></h3>`) 
    
    }
   
    if(response.user && response.user.isEmailverified) {
        document.querySelector('#userName').innerText = 'User: ' + response.user.name 


        let assignedTasks = document.querySelector('#assignedTasksCol')
        assignedTasks.innerHTML = "<hr><u><h3><strong>Assigned tasks</strong></h3></u>" 
    

        response.todaysTasks.tasks.forEach(task => {
            let taskDiv = document.createElement('div')
            taskDiv.style.margin = "15px"
            assignedTasks.appendChild(taskDiv)
            
            let title = document.createElement('h4')
            title.innerHTML = `Title: ${task.title}`
            taskDiv.appendChild(title)
            
            let assignedToHTML = "<strong><u>Assigned to</u>:</strong><br>"
            task.assignedTo.forEach(employeeEmailObj => {
                assignedToHTML = assignedToHTML + ` ${employeeEmailObj.employeeEmail}`
                if(employeeEmailObj.in) {
                    assignedToHTML = assignedToHTML + ` Present from: ${employeeEmailObj.in} `
                }
                if(employeeEmailObj.out) {
                    assignedToHTML = assignedToHTML + ` to: ${employeeEmailObj.out} `
                }
                if(response.user.email == task.assignedTo[0].employeeEmail) {
                    
                    if(!employeeEmailObj.in) {
                        assignedToHTML = assignedToHTML + `
                            <form id="employeeEmailObj-${employeeEmailObj._id}-inTime-forTask-${task._id}">
                                <div class="row">
                                    <div class="col-auto">
                                        <div class="form-group">
                                            <button class="btn btn-outline-success" style="width:60px">From</button>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <input required type="time" class="form-control" name="inTime" style="width:100px">
                                        </div>
                                    </div>
                                </div>
                            </form>
                        `
                    } 
                    // else assignedToHTML = assignedToHTML + `<br>Present from: ${employeeEmailObj.in}`

                   if(!employeeEmailObj.out && employeeEmailObj.in) {
                    assignedToHTML = assignedToHTML + `
                            <form id="employeeEmailObj-${employeeEmailObj._id}-outTime-forTask-${task._id}">
                                <div class="row">
                                    <div class="col-auto">
                                        <div class="form-group">
                                            <button class="btn btn-outline-success" style="width:60px">To</button>
                                        </div>    
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <input required type="time" min="${employeeEmailObj.in}" class="form-control" name="outTime" style="width:100px">
                                        </div>
                                    </div>
                                </div>
                            </form>
                        `
                    }
                    //  else assignedToHTML = assignedToHTML + ` to: ${employeeEmailObj.out}`

                }
                
                assignedToHTML = assignedToHTML + "<br>"
            })

            
            let assignedTo = document.createElement('div')
            assignedTo.innerHTML = assignedToHTML
            // console.log(assignedToHTML, "assignedToHTML")
            taskDiv.appendChild(assignedTo)

            task.assignedTo.forEach(employeeEmailObj => {
                if(response.user.email == task.assignedTo[0].employeeEmail) {
                    
                    if(!employeeEmailObj.in) {
                       
                        document.querySelector(`#employeeEmailObj-${employeeEmailObj._id}-inTime-forTask-${task._id}`).addEventListener("submit", event => {
                            event.preventDefault()
                            // console.log(event.target.inTime.value, typeof(event.target.inTime.value))
                            event.target.classList.add('invisible')

                            fetch(`${serverURL}/employee/addInTime`, {
                                method: 'PATCH',
                                // method: 'POST',
                                credentials: 'include', // to allow cookies 
                                headers : {
                                    "Authorization" : `Bearer ${token}`,
                                    "Content-Type": "application/json"                              
                                },
                                body: JSON.stringify({
                                    employeeEmailObjId: employeeEmailObj._id,
                                    taskId: task._id,
                                    inTime: event.target.inTime.value,
                                    assignedTo: task.assignedTo
                                })                        
                            })
                            .then(response => response.json())
                            .then(response => dashboard(response))
                            .catch(reject => console.log(reject))                        
                        })

                    }

                   if(!employeeEmailObj.out && employeeEmailObj.in) {
                        
                        document.querySelector(`#employeeEmailObj-${employeeEmailObj._id}-outTime-forTask-${task._id}`).addEventListener("submit", event => {
                            event.preventDefault()
                            // console.log(event.target.outTime.value, typeof(event.target.outTime.value))
                            event.target.classList.add('invisible')

                            fetch(`${serverURL}/employee/addOutTime`, {
                                method: 'PATCH',
                                // method: 'POST',
                                credentials: 'include', // to allow cookies 
                                headers : {
                                    "Authorization" : `Bearer ${token}`,
                                    "Content-Type": "application/json"                              
                                },
                                body: JSON.stringify({
                                    employeeEmailObjId: employeeEmailObj._id,
                                    employeeEmail: employeeEmailObj.employeeEmail,
                                    taskId: task._id,
                                    outTime: event.target.outTime.value,
                                    assignedTo: task.assignedTo
                                })                        
                            })
                            .then(response => response.json())
                            .then(response => dashboard(response))
                            .catch(reject => console.log(reject)) 
                        
                        })

                    }

                }
                
            })

            let details = document.createElement('div')
            details.classList.add('.taskDetails')
            details.innerHTML = `<h4>Details:</h4>${task.details}`
            taskDiv.appendChild(details)

            if(response.user.email == task.assignedTo[0].employeeEmail) {


                let imageUploadFormHTML = `
                            <form id="formImageforTask-${task._id}">
                                <div class="row row-cols-1 row-cols-lg">
                                    <div class="col col-12 col-lg-10">
                                        <div class="custom-file mb-3">
                                            <input required type="file" accept="image/*" class="custom-file-input" id="imageUploadInput--${task._id}" name="imageUploadInput">
                                            <label class="custom-file-label" for="imageUploadInput" id="imageUploadInput--${task._id}-label">Choose file to report submition</label>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-group">
                                            <button class="btn btn-outline-success">Add file</button>
                                        </div>    
                                    </div>
                                </div>
                            </form>
                        `

                let imageUploadFormDiv = document.createElement('div')   
                imageUploadFormDiv.innerHTML = imageUploadFormHTML     
                taskDiv.appendChild(imageUploadFormDiv)

                document.querySelector(`#imageUploadInput--${task._id}`).addEventListener("change", event => {
                    // console.log(event.target.value, typeof(event.target.value),"event.target.value imageUploadInput")
                    
                    let showFileName = ""
                    // for(l of event.target.value) {
                    //     console.log(l, 'l')
                    //     if(l == "\\" || l == "/") showFileName = ""
                    //     else showFileName = showFileName + l
                    // }
                    for(let i = 0; i < event.target.value.length; i++) {
                        if(event.target.value[i] == "\\" || event.target.value[i] == "/") showFileName = ""
                        else showFileName = showFileName + event.target.value[i]
                    }
                    document.querySelector(`#imageUploadInput--${task._id}-label`).innerText = showFileName
                 
                })

                document.querySelector(`#formImageforTask-${task._id}`).addEventListener("submit", event => {
                    event.preventDefault()
                    document.querySelector(`#imageUploadInput--${task._id}-label`).innerText = "Uploading..."

                    const form = new FormData(document.querySelector(`#formImageforTask-${task._id}`));
                    fetch(`${serverURL}/employee/submitReportImage/${task._id}`, {
                      method: 'POST',
                      credentials: 'include', // to allow cookies 
                        headers : {
                            "Authorization" : `Bearer ${token}`,
                            // "Content-Type": "multipart/form-data"                              
                        },
                      body: form
                    }).then(response => response.json())
                    .then(response => {    
                        console.log(response, 'response from submitImage')
                        dashboard(response)
                    })
                    .catch(reject => console.log(reject, 'reject from submitImage'))


                    // console.log(event.target)
                })
            }
            
            if(task.report.length) {
                let reportDiv = document.createElement('div')
                let reportHTML = `
                    <h4>Reported Images</h4>
                `
                task.report.forEach(imageURL => reportHTML = reportHTML + `<img style="margin: 10px" src=${imageURL}>`)
                reportDiv.innerHTML = reportHTML
                taskDiv.appendChild(reportDiv)
            }



            let hr = document.createElement('hr')
            hr.style.borderTop = "1px dashed rgba(0, 0, 0, 0.1)"
            taskDiv.insertAdjacentElement('afterend', hr)
                        

        })

    }


    if(response.user && response.user.isEmployer && response.employeesWaiting && response.user.isEmailverified) {

       
        document.querySelector('#applicationsToJoinRow').classList.remove('d-none')

        document.querySelector('#applicationsToJoinCol').innerHTML = ""
        
        response.employeesWaiting.forEach(employee => {
            if(!employee.allowedByEmployer) {
                // console.log(employee)
                let applicationsToJoinCol = document.querySelector('#applicationsToJoinCol')
                applicationsToJoinCol.appendChild(document.createElement('div'))
                let employeeWhoApplied = applicationsToJoinCol.lastChild 
                
                employeeWhoApplied.innerHTML = `<strong>"${employee.name}"</strong> has applied to join your company an an employee form email: <strong>"${employee.email}"</strong> `
                // console.log(employeeWhoApplied)
                employeeWhoApplied.appendChild(document.createElement('br'))
                
                employeeWhoApplied.appendChild(document.createElement('form'))
                
                let allowForm = employeeWhoApplied.lastChild
                allowForm.style.display = "inline"
                allowForm.appendChild(document.createElement('button'))
                allowForm.setAttribute('id', `allowForm-${employee.email}`)
                allowForm.querySelector('button').classList.add('btn')
                allowForm.querySelector('button').classList.add('btn-success')
                allowForm.querySelector('button').innerText = 'Allow'

                employeeWhoApplied.appendChild(document.createElement('form'))
                let rejectForm = employeeWhoApplied.lastChild
                rejectForm.style.display = "inline"
                rejectForm.appendChild(document.createElement('button'))
                rejectForm.setAttribute('id', `rejectForm-${employee.email}`)
                rejectForm.querySelector('button').classList.add('btn')
                rejectForm.querySelector('button').classList.add('btn-danger')
                rejectForm.querySelector('button').innerText = 'Reject'

                employeeWhoApplied.appendChild(document.createElement('hr'))


                allowForm.addEventListener('submit', event => {
                    event.preventDefault()
                    event.target.parentElement.classList.add('d-none')

                    let employeeEmail = event.target.getAttribute('id').split('-')[1]
                    // console.log(employeeEmail, 'employeeEmail')
                    // console.log(token, 'token at allowForm')

                    fetch(`${serverURL}/employer/allowEmployee`, {
                        method: 'PATCH',
                        // method: 'POST',
                        credentials: 'include', // to allow cookies 
                        headers : {
                            "Authorization" : `Bearer ${token}`,
                            "Content-Type": "application/json"                              
                        },
                        body: JSON.stringify({
                            employeeEmail: employeeEmail
                        })                        
                    })
                    .then(response => response.json())
                    .then(response => dashboard(response))
                    .catch(reject => console.log(reject))
                })

                rejectForm.addEventListener('submit', event => {
                    event.preventDefault()
                    event.target.parentElement.classList.add('d-none')

                    let employeeEmail = event.target.getAttribute('id').split('-')[1]
                    // console.log(employeeEmail, 'employeeEmail')
                    // console.log(token, 'token at rejectForm')

                    fetch(`${serverURL}/employer/rejectEmployee/${employeeEmail}`, {
                        // method: 'PATCH',
                        method: 'DELETE',
                        credentials: 'include', // to allow cookies 
                        headers : {
                            "Authorization" : `Bearer ${token}`,
                            "Content-Type": "application/json"                              
                        }
                        // body: JSON.stringify({
                        //     employeeEmail: employeeEmail
                        // })                   
                    })
                    .then(response => response.json())
                    .then(response => dashboard(response))
                    .catch(reject => console.log(reject))
                })

            }
        });
    }

    if(response.user && response.user.isEmployer && response.user.isEmailverified) {
        document.title = 'Company: ' +  response.user.name
        document.querySelector('nav').querySelector('span').innerText = 'Company: ' +  response.user.name
        // document.querySelector('#userName').innerText = 'User: ' + response.user.name
 

        document.querySelector('#selectDateRow').classList.remove('d-none')

        document.querySelector('#employeesUlist').innerHTML = ""
        document.querySelector('#dashboardRow').classList.remove('d-none')


        document.querySelector('#allowedEmployeesListRow').classList.remove('d-none')
        document.querySelector('#assignNewTaskRow').classList.remove('d-none')


        response.allowedEmployees.forEach(employee => {
            // console.log(employee, 'allowed employee')
            document.querySelector('#employeesUlist').appendChild(document.createElement('li'))
            document.querySelector('#employeesUlist').lastChild.classList.add('list-group-item')
            document.querySelector('#employeesUlist').lastChild.innerText = employee.name + ' - ' + employee.email
        })

    }

    if(response.user && !response.user.isEmployer && !response.user.allowedByEmployer && response.user.isEmailverified) {

        document.querySelector('#notAllowedByEmployerRow').classList.remove('d-none')
        document.title = 'Company: ' + response.employerName
        document.querySelector('nav').querySelector('span').innerText = 'Company: ' + response.employerName
        // document.querySelector('#userName').innerText = 'User: ' + response.user.name 
    }

    if(response.user && !response.user.isEmployer && response.user.allowedByEmployer && response.user.isEmailverified) {
        document.title = 'Company: ' + response.employerName
        document.querySelector('nav').querySelector('span').innerText = 'Company: ' +  response.employerName 
        // document.querySelector('#userName').innerText = 'User: ' + response.user.name 

        document.querySelector('#dashboardRow').classList.remove('d-none')
        // document.querySelector('#employeeDashboardRow').classList.remove('d-none')


    }

    if(response.user && !response.user.isEmailverified) {
        document.querySelector('#otpRow').classList.remove('d-none')
    }
   


}

const firstFetch = async () => {
    document.querySelector('#loader').classList.remove('d-none')

    try {
        const response = await fetch(serverURL, {
            method: 'GET',
            credentials: 'include', // to allow cookies 
            headers : {
                "Authorization" : `Bearer ${token}`  
            }
        })
        const responseJSON = await response.json()
        return responseJSON
    } catch (err) {
        throw err
    }
}



const postLogin = async eventTarget => {
    document.querySelector('#loginRegisterRow').classList.add('d-none')
    document.querySelector('#loader').classList.remove('d-none')

    let response = await fetch(`${serverURL}/login`,{
        method: "POST",
        credentials: 'include', // to allow cookies 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: eventTarget.email.value,
            password: eventTarget.password.value
        })
    })
    let responseJSON = response.json()
    return responseJSON
    
}

const postRegisterEmployer = async eventTarget => {
    document.querySelector('#loginRegisterRow').classList.add('d-none')
    document.querySelector('#loader').classList.remove('d-none')
    
    try {

        let response = await fetch(`${serverURL}/register/employer`,{
            method: "POST",
            credentials: 'include', // to allow cookies 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: eventTarget.name.value,
                email: eventTarget.email.value,
                password: eventTarget.password.value,
                rePassword: eventTarget.rePassword.value
            })
        })
        let responseJSON = response.json()
        return responseJSON

    } catch(err) {
        throw err
    }
}



const postRegisterEmployee = async eventTarget => {
    document.querySelector('#loginRegisterRow').classList.add('d-none')
    document.querySelector('#loader').classList.remove('d-none')

    try {

        let response = await fetch(`${serverURL}/register/employee`,{
            method: "POST",
            credentials: 'include', // to allow cookies 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                employerEmail: eventTarget.employerEmail.value,
                name: eventTarget.name.value,
                email: eventTarget.email.value,
                password: eventTarget.password.value,
                rePassword: eventTarget.rePassword.value
            })
        })
        let responseJSON = response.json()
        return responseJSON
    } catch (err) {
        throw err 
    }
    
    
} 
const postOtp = async (eventTarget) => {
    document.querySelector('#otpRow').classList.add('d-none')
    document.querySelector('#loader').classList.remove('d-none')

    try {
        // console.log(token, 'token postOtp')

        const response = await fetch(`${serverURL}/verifyEmailByOtp`, {
            method: 'POST',
            credentials: 'include', // to allow cookies 
            headers : {
                "Authorization" : `Bearer ${token}`,
                "Content-Type": "application/json"  
            },
            body: JSON.stringify({
                otp: eventTarget.otp.value
            })
        })
        const responseJSON = await response.json()
        return responseJSON
    } catch (err) {
        throw err
    }
}

const deleteLogout = async () => {
    document.querySelector('#loader').classList.remove('d-none')
    document.querySelector('#notAllowedByEmployerRow').classList.add('d-none')
    document.querySelector('#applicationsToJoinRow').classList.add('d-none')

    document.querySelector('#otpRow').classList.add('d-none')

    document.querySelector('#selectDateRow').classList.add('d-none')
    document.querySelector('#selectedDateTasksCol').innerHTML = ""

    document.querySelector('#dashboardRow').classList.add('d-none')
    document.querySelector('#allowedEmployeesListRow').classList.add('d-none')
    document.querySelector('#assignNewTaskRow').classList.add('d-none')
    // document.querySelector('#employeeDashboardRow').classList.add('d-none')


    document.title = "Employee's Time-sheet" 
    document.querySelector('nav').querySelector('span').innerText =  "Employee's Time-sheet" 
    document.querySelector('#userName').innerText = ''

    try {
        // console.log(token, 'token deleteLogout')

        const response = await fetch(`${serverURL}/logout`, {
            method: 'DELETE',
            credentials: 'include', // to allow cookies 
            headers : {
                "Authorization" : `Bearer ${token}`,
            }
        })
        const responseJSON = await response.json()
        return responseJSON
    } catch (err) {
        throw err
    }    

}


const assignNewTask = async (eventTarget) => {
    document.querySelector('#loader').classList.remove('d-none')
    document.querySelector('#dashboardRow').classList.add('d-none')


    try {
        // console.log(token, 'token postOtp')

        const response = await fetch(`${serverURL}/employer/assignNewTask`, {
            method: 'POST',
            credentials: 'include', // to allow cookies 
            headers : {
                "Authorization" : `Bearer ${token}`,
                "Content-Type": "application/json"  
            },
            body: JSON.stringify({
                assignTo: eventTarget.assignTo.value,
                title: eventTarget.taskName.value,
                details: document.querySelector('.ck-content').innerHTML

            })
        })
        const responseJSON = await response.json()
        return responseJSON
    } catch (err) {
        throw err
    }

}


const getSelectedDate = async date => {
    try {
        const response = await fetch(`${serverURL}/employer/selectDate/?date=${date}`, {
            method: 'GET',
            credentials: 'include', // to allow cookies 
            headers : {
                "Authorization" : `Bearer ${token}`  
            }
        })
        const responseJSON = await response.json()
        return responseJSON
    } catch (err) {
        throw err
    }
}


const showSelectedDateTasks = response => {
    let {
        // selectedDate,
        selectedDateTasks
    } = response
    if(selectedDateTasks) {
        selectedDate = selectedDateTasks.date.replace("_",", ").replace("_"," ").replace("_"," ")

        let selectedDateTasksCol = document.querySelector('#selectedDateTasksCol')
        selectedDateTasksCol.innerHTML = ""
        selectedDateTasksCol.appendChild(document.createElement('h3'))
        selectedDateTasksCol.lastChild.innerHTML = `<strong>Tasks for ${selectedDate}</strong>`

        selectedDateTasks.tasks.forEach(task => {
            let taskDiv = document.createElement('div')
            taskDiv.style.margin = "15px"
            selectedDateTasksCol.appendChild(taskDiv)

            let title = document.createElement('h4')
            title.innerHTML = `Title: ${task.title}`
            taskDiv.appendChild(title)

            let assignedToHTML = "<strong><u>Assigned to</u>:</strong><br>"
            task.assignedTo.forEach(employeeEmailObj => {
                assignedToHTML = assignedToHTML + ` ${employeeEmailObj.employeeEmail}`
                if(employeeEmailObj.in) {
                    assignedToHTML = assignedToHTML + ` Present from: ${employeeEmailObj.in} `
                }
                if(employeeEmailObj.out) {
                    assignedToHTML = assignedToHTML + ` to: ${employeeEmailObj.out} `
                }
                
                assignedToHTML = assignedToHTML + "<br>"
            })

            let assignedTo = document.createElement('div')
            assignedTo.innerHTML = assignedToHTML
            taskDiv.appendChild(assignedTo)

            let details = document.createElement('div')
            details.classList.add('.taskDetails')
            details.innerHTML = `<h4>Details:</h4>${task.details}`
            taskDiv.appendChild(details)


            if(task.report.length) {
                let reportDiv = document.createElement('div')
                let reportHTML = `
                    <h4>Reported Images</h4>
                `
                task.report.forEach(imageURL => reportHTML = reportHTML + `<img style="margin: 10px" src=${imageURL}>`)
                reportDiv.innerHTML = reportHTML
                taskDiv.appendChild(reportDiv)
            }


            let hr = document.createElement('hr')
            hr.style.borderTop = "1px dashed rgba(0, 0, 0, 0.1)"
            taskDiv.insertAdjacentElement('afterend', hr)
        })

        selectedDateTasksCol.appendChild(document.createElement('hr'))

    }
}


const errorInResponse = response => {
    // console.log(response)
    if(response.err.name == "JsonWebTokenError" || response.err.name == "invalidData") {

        return document.querySelector('#loginRegisterRow').classList.remove('d-none')
        
    }
}








// eventListeners.js

document.querySelector('#loginForm').addEventListener("submit", (event) => {
    event.preventDefault()
    
    postLogin(event.target)
    .then((response) => {

        // console.log(response, "response at postLogin!!!")
        document.querySelector('#loader').classList.add('d-none')            

        if(response.err) return errorInResponse(response) //
        dashboard(response)

    })
    .catch((reject) => console.log(reject))
    
})

document.querySelector('#registerEmployerForm').addEventListener("submit", (event) => {
    event.preventDefault()
    
    postRegisterEmployer(event.target)
    .then((response) => {
        console.log(response)
        token = response.token
        console.log(token, 'token eventListener registerEmployer')
        if(response.user && !response.user.isEmailverified && response.OTPsent) {
            document.querySelector('#loader').classList.add('d-none')
            document.querySelector('#otpRow').classList.remove('d-none')
            

        }
    })
    .catch((reject) => console.log(reject))
    
})

document.querySelector('#registerEmployeeForm').addEventListener("submit", (event) => {
    event.preventDefault()
    
    postRegisterEmployee(event.target)
    .then((response) => {
        console.log(response)
        token = response.token
        console.log(token, 'token eventListener registerEmployee')

        if(response.user && !response.user.isEmailverified && response.OTPsent) {
            document.querySelector('#loader').classList.add('d-none')
            document.querySelector('#otpRow').classList.remove('d-none')
            
            

        }

    })
    .catch((reject) => console.log(reject))
    
})

document.querySelector('#otpForm').addEventListener('submit', event => {
    event.preventDefault()

    postOtp(event.target)
    .then((response)=> {
        document.querySelector('#loader').classList.add('d-none')
        console.log(response)


        if(response.user && response.user.isLoggedIn) document.querySelector('#logoutForm').classList.remove('d-none')
        if(response.user && !response.user.isEmployer && !response.user.allowedByEmployer) return document.querySelector('#notAllowedByEmployerRow').classList.remove('d-none')
        
        dashboard(response)        


    })
    .catch((reject) => console.log(reject))
} )


document.querySelector('#logoutForm').addEventListener('submit', event => {
    event.preventDefault()

    deleteLogout()
    .then(response => {
        document.querySelector('#loader').classList.add('d-none')
        document.querySelector('#logoutForm').classList.add('d-none')
        document.querySelector('#userName').classList.add('d-none')
        document.querySelector('#loginRegisterRow').classList.remove('d-none')
     


        document.querySelector('#emailLogin').value = ''
        document.querySelector('#passwordLogin').value = ''

        document.querySelector('#nameRegisterEmployer').value = ''
        document.querySelector('#emailRegisterEmployer').value = ''
        document.querySelector('#passwordRegisterEmployer').value = ''
        document.querySelector('#reEnteredPasswordRegisterEmployer').value = ''

        document.querySelector('#employerEmailRegisterEmployee').value = ''
        document.querySelector('#nameRegisterEmployee').value = ''
        document.querySelector('#emailRegisterEmployee').value = ''
        document.querySelector('#passwordRegisterEmployee').value = ''
        document.querySelector('#reEnteredPasswordRegisterEmployee').value = ''


        console.log(response)
        
        console.log(token, 'token1')
        token = undefined
        console.log(token, 'token2')

    })
    .catch(reject => console.log(reject))

})


document.querySelector('#assignNewTaskForm').addEventListener('submit', event => {
    event.preventDefault()

    assignNewTask(event.target)
    .then(response => {
        document.querySelector('#loader').classList.add('d-none')
        document.querySelector('#dashboardRow').classList.remove('d-none')

        event.target.assignTo.value = ""
        event.target.taskName.value = ""
        console.log(document.querySelector('.ck-content').childNodes, 'innerHTML of ck-content') 

        theEditor.setData('')
        console.log(response)

        dashboard(response)

    })
    .catch(reject => console.log(reject))
})


document.querySelector('#selectDateForm').addEventListener("submit", event => {
    event.preventDefault()
    console.log(event.target.selectDateInput.value)
    let selectDate = new Date(event.target.selectDateInput.value)
    selectDate = selectDate.toString()
    selectDate = selectDate.replace(" ", "_").replace(" ", "_").replace(" ", "_")
    selectDate = selectDate.split(" ")[0]
    console.log(selectDate)

    getSelectedDate(selectDate)
    .then(response => {
        console.log(response)
        showSelectedDateTasks(response)
    })
    .catch(reject => console.log(reject))

})








// app.js


firstFetch()
.then((response) => {
    
    // console.log(response, "response at firstFetch")

    document.querySelector('#loader').classList.add('d-none')
    
    if(response.err) return errorInResponse(response)
    dashboard(response)
    
   
})
.catch((reject) => console.log(reject))




