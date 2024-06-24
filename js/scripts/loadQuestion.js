const mainContent = document.getElementById('main-page');

function getNextQuestion(){
    console.log("getNextQuestion")
const nextButton=document.querySelector(".nextButton")
nextButton.addEventListener('click', function(event) {
    event.preventDefault();
    verifyCount();
    
});
}

function verifyCount() {
    console.log("verifyCount")
    fetch("/verifyCount")
    .then(response => {
        console.log("Statusul răspunsului:", response.status);
        if (response.status === 201) {
            // Redirecționare, urmează URL-ul din headerul Location
            window.location.href = 'adaugaIntrebare.html' ;
            return;
        } else if (response.status === 200) {
            // Verifică tipul de conținut
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                fetchQuestion();
            } else {
                throw new Error('Expected JSON response, but received content type: ' + contentType);
            }
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'A apărut o eroare. Te rugăm să încerci din nou. ' + error.message
        });
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
    console.log("fetchQuestion")
    const addAnswerForm=document.forms[0];
    addAnswerForm.querySelector('input[type="text"]').value="";
    const chapterTitle=document.getElementById("title");
    const url="/question?"+"chapter="+chapterTitle.textContent;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const questionText=document.getElementById("questionText")
        if(data.question)
            questionText.textContent=data.question;
        else
            questionText.textContent=data.message;
    })
    getAnswer()
}

function getChapter(){
    console.log("getChapter")
    const element=document.getElementById('chapters');
    element.addEventListener("click",(event)=>{

        const chapterTitle=document.getElementById("title");
        chapterTitle.textContent=event.target.textContent;
        fetchQuestion();
    })
   
}



function getAnswer() {
    const submitButton = document.querySelector(".verifyButton");
    submitButton.removeEventListener("click", handleAnswerSubmission); // Elimina ascultatorul daca exista
    submitButton.addEventListener("click", handleAnswerSubmission);
}

function handleAnswerSubmission(event) {
    event.preventDefault();
    const addAnswerForm = document.forms[0];
    const answer = addAnswerForm.querySelector('input[type="text"]').value;
    sendAnswer(answer);
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
    getNextQuestion(); 
    getChapter();
    fetchQuestion();
    fetchComment();
    const markButton=document.getElementById("markIncorrectButton")
    console.log(markButton)
    markButton.addEventListener('click', function(event) {
        event.preventDefault();
        markWrong();
    });
    
    })
    .catch(error => {
    console.error('Error loading the chapter:', error);
    mainContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
    });
}

function markWrong(){
   
     fetch("/incorrectProblem", {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Success', 'Question marked as incorrect successfully.', 'success');
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error marking question incorrect:', error);
        Swal.fire('Error', 'Failed to send the request.', 'error');
    });
}
function sendAnswer(answer) {
    console.log("se trimite raspunsul")
    try {
    fetch("/answer", {
    method: 'POST',
    headers: {
    'Content-Type': 'text/plain' // Am schimbat 'text' în 'text/plain'
    },
    body: answer
    }).then(response => response.json())
    .then(data => {
        if(data.success){
            Swal.fire({
                icon: 'success',
                title: 'Raspuns corect',
                text: 'Bravo!'
            }).then((result) => {
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
                                const response = await fetch(`/rating?dificultate=${login}`);
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

function fetchComment(){
    const commentButton=document.querySelector(".commentButton");
    commentButton.addEventListener("click",event=>{
        event.preventDefault();
        const addCommentForm=document.forms[1];
        const comment=addCommentForm.querySelector('input[type="text"]').value
        sendComment(comment);    
    })
}

function sendComment(comment)
{
    try {
        fetch("/comment", {
        method: 'POST',
        headers: {
        'Content-Type': 'text/plain' // Am schimbat 'text' în 'text/plain'
        },
        body: comment
        }).then(response => response.json())
        .then(data => {
            if(data.success){
                Swal.fire({
                    icon: 'success',
                    title: 'Raspuns corect',
                    text: 'Bravo!'
                })
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                  });
            }
     })
    }catch(err)
    {
        concole.log("There s been an error with fetching the comment")
    }

    
}


fetchInnerPage();
exit();




