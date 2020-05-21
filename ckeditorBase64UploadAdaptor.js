
let theEditor
ClassicEditor
.create( document.querySelector( '#editor' )
    , {
        // cloudServices: {
        //     tokenUrl: 'https://70210.cke-cs.com/token/dev/SdFUwOue8aSjStkcF14khqPwLuLr023xFf0YNLtV4csvMGbZfdxL1BUcvoW8',
        //     uploadUrl: 'https://70210.cke-cs.com/easyimage/upload/'
        // }
        // plugins: [Base64UploadAdapter]
    }
)
.then( editor => theEditor = editor)
.catch( error => {
    console.error( error );
} );