


firstFetch()
.then((response) => {
    
    // console.log(response, "response at firstFetch")

    document.querySelector('#loader').classList.add('d-none')
    
    if(response.err) return errorInResponse(response)
    dashboard(response)
    
   
})
.catch((reject) => console.log(reject))


