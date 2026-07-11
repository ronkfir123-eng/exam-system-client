import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';
import { Exam } from '../models/Exam.js'; // הוספנו את זה כדי שנוכל לייצר אובייקט מבחן חדש

// יצירת מופע של ה-Service (זה מה שיתקן את השגיאה!)
const examService = new ExamService();

// 1. הגנה על הדף - לוודא שמי שנכנס לפה הוא באמת מורה מחובר
const currentUser = AuthService.getLoggedInUser();
if (!currentUser || currentUser.role !== 'teacher') {
    window.location.href = 'login.html';
}

// עדכון שם המורה בכותרת
document.getElementById('welcomeMessage').textContent = `ברוך/ה הבא/ה, ${currentUser.name} (מורה)`;

// 2. כפתור התנתקות
document.getElementById('logoutBtn').addEventListener('click', () => {
    AuthService.logout();
});

// 3. הצגת המבחנים הקיימים של המורה
function renderExamsList() {
    const examsList = document.getElementById('examsList');
    examsList.innerHTML = ''; 
    
    // שימוש במופע (examService) ולא במחלקה (ExamService)
    const myExams = examService.getExamsByTeacher(currentUser.id);
    
    if (myExams.length === 0) {
        examsList.innerHTML = '<li>עדיין לא יצרת מבחנים.</li>';
        return;
    }

    myExams.forEach(exam => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${exam.title}</strong> (קוד: ${exam.code}) - ${exam.durationMinutes} דקות
            <button onclick="window.location.href='exam-details.html?id=${exam.id}'">ערוך / הוסף שאלות</button>
        `;
        examsList.appendChild(li);
    });
}

// קריאה לפונקציה כשהדף עולה
renderExamsList();

// 4. יצירת מבחן חדש
document.getElementById('createExamForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorDisplay = document.getElementById('examError');
    errorDisplay.textContent = ''; 

    const title = document.getElementById('examTitle').value;
    const desc = document.getElementById('examDesc').value;
    const category = document.getElementById('examCategory').value;
    const code = document.getElementById('examCode').value;
    const duration = document.getElementById('examDuration').value;

    try {
        // בודקים אם הקוד כבר תפוס
        const allExams = examService.getAllExams();
        if (allExams.find(ex => ex.code === code)) {
            throw new Error("קוד המבחן כבר קיים במערכת, אנא בחר קוד אחר");
        }

        // שימוש ב-OOP: קודם יוצרים אובייקט Exam, ואז שומרים אותו
        const newExam = new Exam(title, desc, category, code, parseInt(duration), currentUser.id);
        examService.saveExam(newExam); // קורא לפונקציה שלך מ-ExamService
        
        e.target.reset();
        renderExamsList();
        alert('המבחן נוצר בהצלחה!');
    } catch (error) {
        errorDisplay.textContent = error.message;
    }
});