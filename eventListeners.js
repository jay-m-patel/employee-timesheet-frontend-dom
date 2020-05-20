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