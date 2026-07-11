import { ExamService } from '../services/ExamService.js';
import { Question } from '../models/Question.js';

const examService = new ExamService();

// 1. קריאת מזהה המבחן מתוך הכתובת (למשל ?id=12345)
const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get('id');

// חזרה לדשבורד אם אין מזהה בכתובת
if (!examId) {
    alert('לא נמצא מזהה מבחן!');
    window.location.href = 'teacher-dashboard.html';
}

// 2. שליפת המבחן המלא ממסד הנתונים
const currentExam = examService.getExamById(examId);

if (!currentExam) {
    alert('המבחן לא נמצא!');
    window.location.href = 'teacher-dashboard.html';
}

// 3. הצגת פרטי המבחן בראש הדף
document.getElementById('displayTitle').textContent = currentExam.title;
const examInfo = document.getElementById('examInfo');
if (examInfo) {
    examInfo.innerHTML = `
        <p><strong>קוד מבחן לסטודנטים:</strong> ${currentExam.code}</p>
        <p><strong>תיאור:</strong> ${currentExam.description}</p>
        <p><strong>זמן:</strong> ${currentExam.durationMinutes} דקות</p>
    `;
}

// 4. פונקציה שמציירת את השאלות הקיימות במבחן
function renderQuestions() {
    const list = document.getElementById('questionsList');
    const count = document.getElementById('questionCount');
    
    if (list) list.innerHTML = '';
    if (count) count.textContent = currentExam.getQuestionCount();

    currentExam.questions.forEach((q, index) => {
        const li = document.createElement('li');
        
        // יצירת רשימת התשובות וצביעת התשובה הנכונה בירוק
        let answersHtml = '<ul>';
        q.answers.forEach((ans, i) => {
            const isCorrect = (i === parseInt(q.correctAnswerIndex));
            answersHtml += `<li style="${isCorrect ? 'color: green; font-weight: bold;' : ''}">
                ${ans} ${isCorrect ? '(תשובה נכונה)' : ''}
            </li>`;
        });
        answersHtml += '</ul>';

        li.innerHTML = `<strong>שאלה ${index + 1}: ${q.text}</strong>` + answersHtml;
        list.appendChild(li);
    });
}

// ציור ראשוני של השאלות הקיימות (אם יש)
renderQuestions();

// 5. טיפול בטופס הוספת שאלה חדשה
const addQuestionForm = document.getElementById('addQuestionForm');
if (addQuestionForm) {
    addQuestionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const text = document.getElementById('qText').value;
        const answers = [
            document.getElementById('ans0').value,
            document.getElementById('ans1').value,
            document.getElementById('ans2').value,
            document.getElementById('ans3').value
        ];
        
        // בדיקה איזו תשובה סומנה כנכונה
        const correctRadio = document.querySelector('input[name="correct"]:checked');
        if (!correctRadio) {
            alert('אנא סמן איזו תשובה היא הנכונה.');
            return;
        }
        const correctIndex = parseInt(correctRadio.value);

        // שימוש במודל שניסחנו מראש ליצירת אובייקט שאלה
        const newQuestion = new Question(text, answers, correctIndex);
        
        // הוספה למבחן ושמירה
        currentExam.addQuestion(newQuestion);
        examService.updateExam(currentExam);
        
        // רענון המסך וניקוי הטופס
        renderQuestions();
        e.target.reset(); 
    });
}