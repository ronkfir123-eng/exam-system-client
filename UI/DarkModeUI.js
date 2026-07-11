// יצירת הכפתור באופן דינמי והוספתו לכל דף
const toggleBtn = document.createElement('button');
toggleBtn.id = 'themeToggleBtn';
toggleBtn.textContent = '🌙 מצב כהה';
document.body.appendChild(toggleBtn);

// בדיקה אם המשתמש כבר בחר מצב כהה בעבר
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️ מצב בהיר';
}

// מאזין ללחיצה על הכפתור
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