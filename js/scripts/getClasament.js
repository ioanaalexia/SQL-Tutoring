document.addEventListener('DOMContentLoaded', ()=>{
    fetch('/scores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(users=>{
            const tableBody = document.querySelector('.problemsTable tbody');
            tableBody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                const scoreCell = document.createElement('td');

                nameCell.textContent = user.username;
                scoreCell.textContent = user.scor;

                row.appendChild(nameCell);
                row.appendChild(scoreCell);
                tableBody.appendChild(row);
            });
        })

        .catch(error => {
            console.error('Error fetching users: ', error);
        });
});