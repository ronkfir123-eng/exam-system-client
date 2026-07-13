// dynamically create a button for toggling dark mode
const toggleBtn = document.createElement('button');
toggleBtn.id = 'themeToggleBtn';
toggleBtn.textContent = '🌙 מצב כהה';
document.body.appendChild(toggleBtn);

// check localStorage for theme preference and apply it
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️ מצב בהיר';
}

// add event listener to toggle dark mode
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        toggleBtn.textContent = '☀️ מצב בהיר';
    } else {
        localStorage.setItem('theme', 'light');
        toggleBtn.textContent = '🌙 מצב כהה';
    }
});