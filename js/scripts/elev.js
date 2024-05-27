const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown_menu');
const heroContent = document.querySelector('#hero'); // obiectul care conține h1 și butonul

toggleBtn.onclick = function () {
    dropDownMenu.classList.toggle('open');
    const isOpen = dropDownMenu.classList.contains('open');

    toggleBtnIcon.classList = isOpen 
    ? 'fa-solid fa-xmark' 
    : 'fa-solid fa-bars';

    // Acum ascunde sau arată conținutul din #hero în funcție de starea meniului
    if (isOpen) {
        heroContent.style.display = 'none'; // Ascunde textul și butonul când meniul este deschis
    } else {
    heroContent.style.display = 'block'; // Arată textul și butonul când meniul este închis
    }
};
