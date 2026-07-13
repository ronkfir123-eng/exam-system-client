import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';

// only allow students to access this page
const currentUser = AuthService.getLoggedInUser();
if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'login.html';
}

const examService = new ExamService();
// get all exams from storage
const allExams = examService.getAllExams(); 

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// render all exams initially
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const query = searchInput.value.trim().toLowerCase();
    
    searchResults.innerHTML = ''; // clear previous results

    // filter exams based on title or code
    const filteredExams = allExams.filter(exam => {
        const titleMatch = exam.title.toLowerCase().includes(query);
        const codeMatch = exam.code.toLowerCase() === query;
        return titleMatch || codeMatch;
    });

    // no exams found
    if (filteredExams.length === 0) {
        searchResults.innerHTML = '<li>לא נמצאו מבחנים התואמים לחיפוש שלך.</li>';
        return;
    }

    // render the filtered exams
    filteredExams.forEach(exam => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${exam.title}</strong> (קוד: ${exam.code}) - ${exam.durationMinutes} דקות
            <br>
            <small>קטגוריה: ${exam.category} | שאלות: ${exam.getQuestionCount()}</small>
            <br>
            <button onclick="window.location.href='take-exam.html?id=${exam.id}'">התחל מבחן</button>
            <br><br>
        `;
        searchResults.appendChild(li);
    });
});