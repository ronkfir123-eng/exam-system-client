import { AuthService } from '../services/AuthService.js';

// get dom elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginError = document.getElementById('loginError');
const regError = document.getElementById('regError');

// redirect based on role
function redirectBasedOnRole(user) {
    if (user.role === 'teacher') {
        window.location.href = 'teacher-dashboard.html';
    } else if (user.role === 'student') {
        window.location.href = 'student-dashboard.html';
    }
}

// -----------------------------------------
// LOGIN LOGIC
// -----------------------------------------
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // prevent the page from refreshing

        const tz = document.getElementById('loginTz').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // attempt to log in
            const user = AuthService.login(tz, password);
            
            // if successful then redirect
            redirectBasedOnRole(user);
        } catch (error) {
            // if there's an error show it on screen
            loginError.textContent = error.message;
        }
    });
}

// -----------------------------------------
// REGISTRATION LOGIC
// -----------------------------------------
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value;
        const tz = document.getElementById('regTz').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;

        try {
            // attempt to register
            AuthService.register(name, tz, password, role);
            
            // auto login the user after successful registration
            const user = AuthService.login(tz, password);
            
            // redirect
            redirectBasedOnRole(user);
        } catch (error) {
            // If tz already exists show error
            regError.textContent = error.message;
        }
    });
}