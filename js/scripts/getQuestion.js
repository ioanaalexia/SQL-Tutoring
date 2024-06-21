const form = document.forms[0];

function generateUrl(base, params) {
    const url = new URL(base);
    url.search = new URLSearchParams(params).toString();
    return url.toString();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const paramKey = form.elements[0].value; 
    const paramValue = form.elements[1].value; 

    const url="/query?"+paramKey+"="+paramValue; 

    fetch(url)
    .then(response=>response.json())
    .then(data => {
        data.forEach(item => {
            
            console.log(item.questionId);
            console.log(item.category);
            console.log(item.questionText);
            console.log(item.correctAnswer);
            console.log(item.difficulty);
            console.log(item.createdBy);
            console.log(item.attempts);
            console.log(item.comments);
        });
    })
    .catch(error => console.error('Error:', error));
});


