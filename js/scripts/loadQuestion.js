const mainContent = document.getElementById('main-page');




function getNextQuestion(){

const nextButton=document.querySelector(".nextButton")
nextButton.addEventListener('click', function(event) {
    event.preventDefault();
    const chapterTitle=document.getElementById("title");
    console.log(chapterTitle.textContent)
    fetchQuestion();//aici aduc urmatoarea intrebare
});
}


function exit(){
    document.querySelector('.exit a').addEventListener('click', function(event) {
    // Opțiunea implicită de redirectionare a link-ului este oprită
    event.preventDefault();
    // Redirecționează utilizatorul către pagina dorită
    window.location.href = 'elev.html';
    });
}

function fetchQuestion(){//iau intrebarea din baza de date
    const addAnswerForm=document.forms[0];
    addAnswerForm.querySelector('input[type="text"]').value=""
    const chapterTitle=document.getElementById("title");
    const url="/getQuestion?"+"chapter="+chapterTitle.textContent;
    console.log(url)
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const questionText=document.getElementById("questionText")
        if(data.question)
            questionText.textContent=data.question;
        else
            questionText.textContent=data.message;
    })
    getAnswer();
}

function getChapter(){
    const element=document.getElementById('chapters');
    element.addEventListener("click",(event)=>{

        const chapterTitle=document.getElementById("title");
        chapterTitle.textContent=event.target.textContent;
        fetchQuestion();
    })
   
}



function getAnswer(){
 
const submitButton=document.querySelector(".verifyButton")
console.log(submitButton)
submitButton.addEventListener("click",event=>{
    console.log("se da submit")
    event.preventDefault();
    const addAnswerForm=document.forms[0];
    const answer=addAnswerForm.querySelector('input[type="text"]').value
    const chapterTitle=document.getElementById("title");
    console.log(answer);
    sendAnswer(answer);
    getNextQuestion();
})
}


function fetchInnerPage(){
    fetch("../html/questions.html")
    .then(response => {
    if (response.ok) {
        return response.text();
    } else {
        throw new Error('Failed to fetch content');
    }
    })
    .then(html => {
    mainContent.innerHTML = html; 
    getChapter();
    fetchQuestion();
    })
    .catch(error => {
    console.error('Error loading the chapter:', error);
    mainContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
    });
}

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
            console.log("succes")
            Swal.fire({
                icon: 'success',
                title: 'Raspuns corect',
                text: 'Bravo!'
            }).then((result) => {
                console.log(result)
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: "Introduceti dificultatea:(grea,medie,usoara)",
                            input: "text",
                            inputAttributes: {
                              autocapitalize: "off"
                            },
                            showCancelButton: true,
                            confirmButtonText: "Trimite",
                            showLoaderOnConfirm: true,
                            preConfirm: async (login) => {
                              try {
                                const response = await fetch(`/sendRating?dificultate=${login}`);
                                if (!response.ok) {
                                  return Swal.showValidationMessage(`
                                    ${JSON.stringify(await response.json())}
                                  `);
                                }
                                return response.json();
                              } catch (error) {
                                Swal.showValidationMessage(`
                                  Request failed: ${error}
                                `);
                              }
                            },
                            allowOutsideClick: () => !Swal.isLoading()
                          })
                        }
                
                     
                }) 
            }else {
                  Swal.fire({
                  icon: 'error',
                  title: 'Raspuns gresit',
                  text: 'Try again!',
                  text: data.message
              });
          }
        
        })
    
    }catch(err)
    {
        concole.log("There s been an error with fetching the answer")
    }
}


fetchInnerPage();
exit();



