// Replace this URL with your actual endpoint or server-side script
const url = '/api/user/data'; // Example URL

// Fetch data from the server
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Assuming the response data structure matches what you need
        document.getElementById('scor_value').textContent = data.scor;
        document.getElementById('rezolvate_value').textContent = data.probleme_rezolvate;
        document.getElementById('marcate_value').textContent = data.probleme_marcate;
        document.getElementById('propuse_value').textContent = data.probleme_propuse;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });