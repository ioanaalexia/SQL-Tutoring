document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/user-statistics', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Aici parsăm direct JSON-ul
    })
    .then(data => {
        console.log('Received data:', data); // Debugging
        document.getElementById('scor_value').innerText = data.scor;
        document.getElementById('rezolvate_value').innerText = data.rezolvate;
        document.getElementById('propuse_value').innerText = data.propuse;
        document.getElementById('marcate_value').innerText = data.marcate;

        console.log('Scor:', data.scor);
        console.log('Rezolvate:', data.rezolvate);
        console.log('Propuse:', data.propuse);
        console.log('Marcate:', data.marcate);
    })
    .catch(error => console.error('Error fetching user data:', error));

    console.log('scor_value element:', document.getElementById('scor_value'));
    console.log('rezolvate_value element:', document.getElementById('rezolvate_value'));
    console.log('propuse_value element:', document.getElementById('propuse_value'));
    console.log('marcate_value element:', document.getElementById('marcate_value'));
});