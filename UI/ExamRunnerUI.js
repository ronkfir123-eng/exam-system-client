import { ExamService } from '../services/ExamService.js';
import { AuthService } from '../services/AuthService.js';
import { ExamResult } from '../models/ExamResult.js';
import StorageService from '../services/StorageService.js';

// 1. אבטחה: נוודא שרק סטודנט יכול לגשת לכאן
const currentUser = AuthService.getLoggedInUser();
if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'login.html';
}

const examService = new ExamService();
const examRunnerElement = document.getElementById("examRunner");

// 2. משיכת מזהה המבחן מה-URL (למשל: take-exam.html?id=123)
const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get('id');
const exam = examService.getExamById(examId);

// 3. הפונקציה שלך לציור המבחן (מותאמת קלות)
function renderExamRunner(exam) {
    if (!exam) {
        examRunnerElement.innerHTML = `<div class="alert alert-danger">המבחן לא נמצא.</div>`;
        return;
    }

    if (exam.questions.length === 0) {
        examRunnerElement.innerHTML = `<div class="alert alert-warning">במבחן זה אין שאלות.</div>`;
        return;
    }

    examRunnerElement.innerHTML = `
      <h2>${exam.title}</h2>
      <p>יש לענות על כל השאלות וללחוץ על סיום.</p>
      <hr>
    `;

    exam.questions.forEach((question, questionIndex) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question-box";
        questionDiv.innerHTML = `
        <h5>שאלה ${questionIndex + 1}: ${question.text}</h5>
        ${question.answers.map((answer, answerIndex) => `
          <label class="answer-label">
            <input type="radio" name="question-${questionIndex}" value="${answerIndex}">
            ${answer}
          </label><br>
        `).join("")}
        <br>
      `;
        examRunnerElement.appendChild(questionDiv);
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "סיים ושלח מבחן";
    
    submitButton.addEventListener("click", () => {
        checkExam(exam, submitButton);
    });

    examRunnerElement.appendChild(submitButton);
}

// 4. הפונקציה שלך לבדיקת המבחן - משודרגת עם שמירת הנתונים!
function checkExam(exam, submitButton) {
    let score = 0;
    let studentAnswers = []; // נשמור את התשובות שהסטודנט בחר

    exam.questions.forEach((question, questionIndex) => {
        const selectedAnswer = document.querySelector(`input[name="question-${questionIndex}"]:checked`);
        
        let userAnswerIndex = -1; // -1 אומר שלא סומנה תשובה
        
        if (selectedAnswer) {
            userAnswerIndex = Number(selectedAnswer.value);
            if (question.isCorrect(userAnswerIndex)) {
                score++;
            }
        }
        studentAnswers.push(userAnswerIndex);
    });

    // --- החלק החדש: יצירת אובייקט תוצאה ושמירתו ב-localStorage ---
    const result = new ExamResult(
        currentUser.id,
        exam.id,
        exam.title,
        score,
        exam.questions.length,
        studentAnswers
    );

    const allResults = StorageService.getResults();
    allResults.push(result);
    StorageService.saveResults(allResults); // שומרים במסד הנתונים!

    // --- הצגת התוצאה לסטודנט ---
    submitButton.disabled = true; // מניעת הגשה כפולה
    
    const resultDiv = document.createElement("div");
    resultDiv.innerHTML = `
      <hr>
      <h3>תוצאת מבחן</h3>
      <p>ציון: ${result.getPercent()}</p>
      <p>ענית נכונה על ${score} מתוך ${exam.questions.length} שאלות.</p>
      <button onclick="window.location.href='student-dashboard.html'">חזור לדף הראשי</button>
    `;
    
    examRunnerElement.appendChild(resultDiv);
}

// הפעלת הציור כשהדף נטען
renderExamRunner(exam);