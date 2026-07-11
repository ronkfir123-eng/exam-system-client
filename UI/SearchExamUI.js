import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';

// 1. הגנה על הדף - רק סטודנט מחובר יכול לחפש מבחנים
const currentUser = AuthService.getLoggedInUser();
if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'login.html';
}

const examService = new ExamService();
// מושכים את כל המבחנים מראש כדי שנוכל לחפש בתוכם
const allExams = examService.getAllExams(); 

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// 2. פונקציית החיפוש שמופעלת בעת שליחת הטופס
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // לוקחים את הטקסט, מנקים רווחים והופכים לאותיות קטנות (באנגלית) כדי שהחיפוש לא יהיה רגיש לאותיות גדולות/קטנות
    const query = searchInput.value.trim().toLowerCase();
    
    searchResults.innerHTML = ''; // מנקים תוצאות קודמות

    // סינון המערך - נבדוק אם המחרוזת נמצאת בשם המבחן או שווה לקוד שלו
    const filteredExams = allExams.filter(exam => {
        const titleMatch = exam.title.toLowerCase().includes(query);
        const codeMatch = exam.code.toLowerCase() === query;
        return titleMatch || codeMatch;
    });

    // אם לא נמצאו תוצאות
    if (filteredExams.length === 0) {
        searchResults.innerHTML = '<li>לא נמצאו מבחנים התואמים לחיפוש שלך.</li>';
        return;
    }

    // אם נמצאו מבחנים, נצייר אותם על המסך
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