const form = document.forms[0];
const mainContent = document.querySelector('main.main-content');

function generateUrl(base, params) {
    const url = new URL(base);
    url.search = new URLSearchParams(params).toString();
    return url.toString();
}



function addRowToTable(item) {
    const table = document.querySelector('.problemsTable');
    const newRow = table.insertRow(-1);

    const idCell = newRow.insertCell(0);
    idCell.textContent = item.questionId;

    const capitolCell = newRow.insertCell(1);
    capitolCell.textContent = item.category;

    const cerintaCell = newRow.insertCell(2);
    cerintaCell.textContent = item.questionText;

    const raspunsCell1 = newRow.insertCell(3);
    raspunsCell1.textContent = item.correctAnswer;

    const dificultateCell = newRow.insertCell(4);
    dificultateCell.textContent = item.difficulty;

    const incercariCell = newRow.insertCell(5);
    incercariCell.textContent = item.attempts;

    const comentariiCell = newRow.insertCell(6);
    comentariiCell.textContent = item.comments.map(comment => comment.comment).join(', ');
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const paramKey = form.elements[0].value; 
    const paramValue = form.elements[1].value; 

    const url="/query?"+paramKey+"="+paramValue; 

    fetch(url)
    .then(response=>response.json())
    .then(data => {
        
        fetch('administrareDate.html')
        .then(response => response.text())
        .then(html => {
          mainContent.innerHTML = html;
       
        
        const tabel=document.querySelector('.problemsTable');

        const table = document.getElementById("table");
        
        if (Array.isArray(data)) {
            
            data.forEach(item => {
                
                addRowToTable(item);
            });
        } else {
            
            addRowToTable(data);
        }
    })
})
    .catch(error => console.error('Error:', error));
});


