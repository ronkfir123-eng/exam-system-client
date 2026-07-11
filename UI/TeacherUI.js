import { AuthService } from '../services/AuthService.js';
import { ExamService } from '../services/ExamService.js';
import { Exam } from '../models/Exam.js';

// Initialize Service
const examService = new ExamService();

// 1. Auth Protection
const currentUser = AuthService.getLoggedInUser();
if (!currentUser || currentUser.role !== 'teacher') {
    window.location.href = 'login.html';
}

// Set Teacher Name
document.getElementById('welcomeMessage').textContent = `ברוך/ה הבא/ה, ${currentUser.name} (מורה)`;

// 2. Logout Logic
document.getElementById('logoutBtn').addEventListener('click', () => {
    AuthService.logout();
});

// 3. Render Exams List (with Export and Delete Buttons)
function renderExamsList() {
    const examsList = document.getElementById('examsList');
    examsList.innerHTML = ''; 
    
    const myExams = examService.getExamsByTeacher(currentUser.id);
    
    if (myExams.length === 0) {
        examsList.innerHTML = '<li>עדיין לא יצרת מבחנים.</li>';
        return;
    }

    myExams.forEach(exam => {
        const li = document.createElement('li');
        li.style.marginBottom = "15px";
        li.style.padding = "10px";
        li.style.borderBottom = "1px solid #ccc";

        li.innerHTML = `
            <strong>${exam.title}</strong> (קוד: ${exam.code}) - ${exam.durationMinutes} דקות
            <br>
            <button onclick="window.location.href='exam-details.html?id=${exam.id}'">ערוך / הוסף שאלות</button>
        `;

        // --- Export Button ---
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'ייצוא JSON';
        exportBtn.style.marginRight = '10px';
        exportBtn.onclick = () => {
            const dataStr = JSON.stringify(exam);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${exam.title}.json`;
            a.click();
        };
        li.appendChild(exportBtn);

        // --- Delete Button ---
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'מחק מבחן';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.style.marginRight = '10px';
        deleteBtn.style.backgroundColor = '#d9534f';
        deleteBtn.style.color = 'white';
        deleteBtn.onclick = () => {
            if (confirm(`האם אתה בטוח שברצונך למחוק את המבחן "${exam.title}"?`)) {
                examService.deleteExam(exam.id);
                renderExamsList();
            }
        };
        li.appendChild(deleteBtn);

        examsList.appendChild(li);
    });
}

// Initial render
renderExamsList();

// 4. Create Exam Logic
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
        const allExams = examService.getAllExams();
        if (allExams.find(ex => ex.code === code)) {
            throw new Error("קוד המבחן כבר קיים במערכת, אנא בחר קוד אחר");
        }

        const newExam = new Exam(title, desc, category, code, parseInt(duration), currentUser.id);
        examService.saveExam(newExam);
        
        e.target.reset();
        renderExamsList();
        alert('המבחן נוצר בהצלחה!');
    } catch (error) {
        errorDisplay.textContent = error.message;
    }
});

// 5. Import Logic (for JSON files)
document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            // Ensure ExamService has saveImportedExam implemented as discussed
            examService.saveImportedExam(importedData);
            renderExamsList();
            alert('המבחן יובא בהצלחה!');
        } catch (err) {
            alert('שגיאה בייבוא הקובץ: וודא שהוא בפורמט JSON תקין');
        }
    };
    reader.readAsText(file);
});