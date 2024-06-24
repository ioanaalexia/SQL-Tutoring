document.getElementById('profile-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const formEmail = document.getElementById('formEmail').value;
    console.log(formEmail);
    const password = document.getElementById('password').value;

    console.log("Form data:", { name, formEmail, password });

    const response =  fetch('/api/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            name,
            formEmail,
            password
        })
    });

    if (response.ok) {
        alert('Modificările au fost salvate cu succes.');
    } else {
        alert('A apărut o eroare la salvarea modificărilor.');
    }
});
