
// Get reference to the users window element
var uwindow = document.querySelector('.users-window');

// Function to show or hide the users window
function show_hide() {
    if (uwindow.style.display === "block") {
        uwindow.style.display = "none";
    } else {
        uwindow.style.display = "block";
    }
}

// Function to handle window resize events
function handleResize() {
    if (window.innerWidth > 900) {
        uwindow.style.display = "block";
    } else {
        uwindow.style.display = "none";
    }
}

// Function to handle mouse leave events on the users window
function handleMouseLeave() {
    if (window.innerWidth <= 900) {
        uwindow.style.display = "none";
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);
uwindow.addEventListener('mouseleave', handleMouseLeave);