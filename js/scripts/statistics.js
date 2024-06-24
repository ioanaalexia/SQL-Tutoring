document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/problems', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(problems => {
            console.log('Fetched problems:', problems);
            const tableBody = document.querySelector('#problemsTable tbody');
            tableBody.innerHTML = '';

            if (Array.isArray(problems)) {
                problems.forEach(problem => {
                    const row = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    const attemptsCell = document.createElement('td');
                    const statusCell = document.createElement('td');
                    const difficultyCell = document.createElement('td');

                    nameCell.textContent = problem.nume_problema;
                    attemptsCell.textContent = problem.incercari_gresite;
                    statusCell.textContent = problem.status;
                    difficultyCell.textContent = problem.difficulty;

                    row.appendChild(nameCell);
                    row.appendChild(attemptsCell);
                    row.appendChild(statusCell);
                    row.appendChild(difficultyCell);

                    tableBody.appendChild(row);
                });
            } else {
                console.error('Problems is not an array:', problems);
            }
        })
        .catch(error => {
            console.error('Error fetching problems:', error);
        });
});
