
const mainContent = document.getElementById('main-page');
const element=document.getElementById('chapters');

document.querySelector('.exit a').addEventListener('click', function(event) {
    // Opțiunea implicită de redirectionare a link-ului este oprită
    event.preventDefault();
    // Redirecționează utilizatorul către pagina dorită
    window.location.href = 'elev.html';
});
function loadQuestion(){
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
        const addAnswerForm=document.forms[0];
        console.log(addAnswerForm)
        addAnswerForm.addEventListener('submit',function(e){
        e.preventDefault();
        const answer=addAnswerForm.querySelector('input[type="text"]').value
        console.log(answer);
        sendAnswer(answer);
    })
    }) 
}

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
    
    loadQuestion();
  
})
.catch(error => {
    console.error('Error loading the chapter:', error);
    mainContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
});

function sendAnswer(answer) {
    try {
        fetch("/addAnswer", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain' // Am schimbat 'text' în 'text/plain'
            },
            body: answer
        }).then(response => response.json())
        .then(data => {
           
            console.log(data.success)
            if(data.success){
                Swal.fire({
                    icon: 'success',
                    title: 'Raspuns corect',
                    text: 'Bravo!'
                }).then((result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                        loadQuestion();
                    }
                });
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Raspuns gresit',
                    text: 'Try again!',
                    text: data.message
                });
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } catch (error) {
        console.error('Error in try-catch block:', error);
    }
}


        



