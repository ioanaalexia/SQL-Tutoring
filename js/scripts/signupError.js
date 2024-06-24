document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('signup-form'));
    const searchParams = new URLSearchParams();
   
    for (const pair of formData) {
        searchParams.append(pair[0], pair[1]);
    }
    console.log('hello')
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'You are now logged in!'
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    window.location.href = '/html/elev.html';
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Sign up failed',
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

       