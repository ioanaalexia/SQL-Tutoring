document.addEventListener("DOMContentLoaded", () => {
    
    fetch('/api/user-info')
        .then(response => response.json())
        .then(data => {
            // Populați elementele HTML cu datele utilizatorului
            document.getElementById("username").textContent = data.username;
            document.getElementById("email").textContent = data.email;
            document.getElementById("nume").textContent=data.username;
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
});