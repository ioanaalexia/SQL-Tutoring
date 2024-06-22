const importare=document.getElementById("import")
const exportJson=document.getElementById("exportjson")
const exportXml=document.getElementById("exportxml")

importare.addEventListener('click', (event) => {
    event.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please select a file.");
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/import', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            Swal.fire({
                icon: 'success',
                title: 'Succes',
                text: 'Intreabarile au fost importate!'
            })}
            else {
                Swal.fire({
                icon: 'error',
                title: ':(((',
                text: 'Datele nu au putut fi importate!',
                text: data.message
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


exportJson.addEventListener("click",(event)=>{
    event.preventDefault();
    fetch("/exportJson")
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            throw new Error('Network response was not ok.');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'questions.json';  // Numele fișierului
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
})


exportXml.addEventListener("click", (event) => {
    event.preventDefault();
    fetch("/exportXml")
        .then(response => {
            if (response.ok) {
                return response.blob();  // Convertim răspunsul în blob
            }
            throw new Error('Network response was not ok.');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'questions.xml';  // Numele fișierului
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
});
