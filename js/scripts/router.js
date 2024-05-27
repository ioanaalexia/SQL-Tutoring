document.addEventListener("DOMContentLoaded", function() {
    const mainContent = document.getElementById('main-page');

    document.querySelector('.exit a').addEventListener('click', function(event) {
        // Opțiunea implicită de redirectionare a link-ului este oprită
        event.preventDefault();
        // Redirecționează utilizatorul către pagina dorită
        window.location.href = 'elev.html';
    });
    
    document.querySelectorAll('.side-nav a').forEach(link => {
        link.addEventListener('click', navigate);
    });

    

    function navigate(event) {
        
        event.preventDefault();

        
        const path = event.target.closest('a').getAttribute('href');

        
        fetchContent(path);
    }

    function fetchContent(path) {
       
        fetch(`../html${path}.html`)  // Adjust the path based on your actual HTML files location
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Failed to fetch content');
                }
            })
            .then(html => {
                mainContent.innerHTML = html; // Inject the HTML content into the main element
            })
            .catch(error => {
                console.error('Error loading the chapter:', error);
                mainContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
            });
    }
});

