document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('login-form'));
    const searchParams = new URLSearchParams();

    for (const pair of formData) {
        searchParams.append(pair[0], pair[1]);
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.success && data.redirectUrl==='/html/admin.html') {
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'You are now logged in!'
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    
                    window.location.href = '/html/admin.html';
                }
            });
        } else if(data.success && data.redirectUrl==='/html/elev.html')
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You are now logged in!'
                }).then((result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                        
                        window.location.href = '/html/elev.html';
                    }
                });
            }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again later.'
        });
    });
});

       