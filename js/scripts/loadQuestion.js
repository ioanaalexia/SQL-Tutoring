
const mainContent = document.getElementById('main-page');
const element=document.getElementById('chapters');

document.querySelector('.exit a').addEventListener('click', function(event) {
    // Opțiunea implicită de redirectionare a link-ului este oprită
    event.preventDefault();
    // Redirecționează utilizatorul către pagina dorită
    window.location.href = 'elev.html';
});

fetch("../html/questions.html")
.then(response => {
    if (response.ok) {
        
        return response.text();
    } else {
        throw new Error('Failed to fetch content');
    }
})
.then(html => {
    mainContent.innerHTML = html; // Inject the HTML content into the main element
    
    element.addEventListener("click",event=>{
        const chapterTitle=document.getElementById("title");
        chapterTitle.textContent=event.target.textContent;//aici am titlul capitolului
        
        
        
        const url="/getQuestion?"+"chapter="+chapterTitle.textContent;
        console.log(url)
        fetch(url)
        .then(response => {
            if (response.ok) {
               return response.text();
            } else {
                throw new Error('Failed to fetch content');
            }
        }).then(data => {
            const parsedData = JSON.parse(data);
            const questionText=document.getElementById("questionText")
            questionText.textContent=parsedData.question;
           
        })
        
    }) 
  
})
.catch(error => {
    console.error('Error loading the chapter:', error);
    mainContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
});


        



