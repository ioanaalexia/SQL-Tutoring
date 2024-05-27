document.addEventListener('DOMContentLoaded', function () {
    const loginLabel = document.querySelector('.login label');
    const signupLabel = document.querySelector('.signup label');

    loginLabel.addEventListener('click', function() {
        document.getElementById('loginForm').action = '/login';
        document.getElementById('signupForm').action = '/signup';
    });

    signupLabel.addEventListener('click', function() {
        document.getElementById('signupForm').action = '/signup';
        document.getElementById('loginForm').action = '/login';
    });
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Autentificare eșuată');
        }

        // Redirecționăm utilizatorul către pagina de elev.html
        window.location.href = '/html/elev.html';
    } catch (error) {
        console.error('Eroare:', error);
        // Afișăm mesajul de eroare utilizând SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message || 'Ceva nu a mers bine! Vă rugăm să încercați din nou mai târziu.',
        });
    }
});

