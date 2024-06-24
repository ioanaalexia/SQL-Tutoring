document.getElementById('profile-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const formEmail = document.getElementById('formEmail').value;
    console.log(formEmail);
    const password = document.getElementById('password').value;

    console.log("Form data:", { name, formEmail, password });


    
    fetch('/api/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            name,
            formEmail,
            password
        })
    }).then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.success){
            Swal.fire({
                icon: 'success',
                title: 'Succes!',
                text: 'Parola a fost schimbata!'
            })
        }else{
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
        }
 })

});
