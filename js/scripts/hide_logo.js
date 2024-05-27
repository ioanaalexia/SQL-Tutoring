document.querySelector('.side-nav').addEventListener('mouseover', function() {
    document.querySelector('.logo').style.visibility = 'hidden';
    document.querySelector('.spacer').style.flexGrow = '1';
});

document.querySelector('.side-nav').addEventListener('mouseout', function() {
    document.querySelector('.logo').style.visibility = 'visible';
    document.querySelector('.spacer').style.flexGrow = '0';
});
