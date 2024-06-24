document.addEventListener("DOMContentLoaded", () => {
    
    fetch('/api/user-info')
        .then(response => response.json())
        .then(data => {
            document.getElementById("username").textContent = data.username;
            document.getElementById("email").textContent = data.email;
            const numeElement = document.getElementById("nume");
            if (numeElement) {
                numeElement.textContent = data.username;
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
});