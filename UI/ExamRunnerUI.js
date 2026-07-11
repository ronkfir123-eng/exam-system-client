import { ExamService } from '../services/ExamService.js';
import { AuthService } from '../services/AuthService.js';
import { ExamResult } from '../models/ExamResult.js';
import StorageService from '../services/StorageService.js';

const currentUser = AuthService.getLoggedInUser();
if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'login.html';
}

const examService = new ExamService();
const examRunnerElement = document.getElementById("examRunner");

const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get('id');
const exam = examService.getExamById(examId);

let timerInterval; // משתנה גלובלי לשמירת הטיימר

function renderExamRunner(exam) {
    if (!exam) {
        examRunnerElement.innerHTML = `<div class="alert alert-danger">המבחן לא נמצא.</div>`;
        return;
    }
    if (exam.questions.length === 0) {
        examRunnerElement.innerHTML = `<div class="alert alert-warning">במבחן זה אין שאלות.</div>`;
        return;
    }

    // הוספת תצוגת הטיימר
    examRunnerElement.innerHTML = `
      <h2>${exam.title}</h2>
      <h4 id="timerDisplay" style="color: #d9534f; font-weight: bold;">מחשב זמן...</h4>
      <p>יש לענות על כל השאלות וללחוץ על סיום.</p>
      <hr>
    `;

    // ציור השאלות
    exam.questions.forEach((question, questionIndex) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question-box";
        questionDiv.id = `qbox-${questionIndex}`; // מזהה ייחודי כדי שנוכל לצבוע אותן אחר כך
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
    submitButton.className = "btn btn-primary";
    submitButton.textContent = "סיים ושלח מבחן";
    
    submitButton.addEventListener("click", () => {
        clearInterval(timerInterval); // עצירת הטיימר בלחיצה
        checkExam(exam, submitButton);
    });

    examRunnerElement.appendChild(submitButton);

    // --- לוגיקת הטיימר ---
    let timeLeft = exam.durationMinutes * 60; // המרה לשניות
    const timerDisplay = document.getElementById("timerDisplay");

    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.textContent = `זמן נותר: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("הזמן נגמר! המבחן מוגש אוטומטית.");
            checkExam(exam, submitButton);
        }
    }, 1000);
}

function checkExam(exam, submitButton) {
    let score = 0;
    let studentAnswers = []; 

    exam.questions.forEach((question, questionIndex) => {
        const selectedAnswer = document.querySelector(`input[name="question-${questionIndex}"]:checked`);
        let userAnswerIndex = -1; 
        
        const qBox = document.getElementById(`qbox-${questionIndex}`);
        const labels = qBox.querySelectorAll('label');

        if (selectedAnswer) {
            userAnswerIndex = Number(selectedAnswer.value);
            if (question.isCorrect(userAnswerIndex)) {
                score++;
            }
        }
        studentAnswers.push(userAnswerIndex);

        // --- בונוס: צביעת התשובות (Review) ---
        labels.forEach((label, i) => {
            const input = label.querySelector('input');
            input.disabled = true; // נעילת השאלות לאחר הגשה

            if (i === parseInt(question.correctAnswerIndex)) {
                label.style.color = "green";
                label.style.fontWeight = "bold";
                label.innerHTML += " (תשובה נכונה) ✓";
            } else if (i === userAnswerIndex && !question.isCorrect(userAnswerIndex)) {
                label.style.color = "red";
                label.style.textDecoration = "line-through";
                label.innerHTML += " (הטעות שלך) ✗";
            }
        });
    });

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
    StorageService.saveResults(allResults);

    submitButton.disabled = true; 
    
    const resultDiv = document.createElement("div");
    resultDiv.innerHTML = `
      <hr>
      <h3>תוצאת מבחן</h3>
      <p>ציון: ${result.getPercent()}%</p>
      <p>ענית נכונה על ${score} מתוך ${exam.questions.length} שאלות.</p>
      <p><em>גלול למעלה כדי לראות את התשובות הנכונות.</em></p>
      <button class="btn btn-secondary mt-3" onclick="window.location.href='student-dashboard.html'">חזור לדף הראשי</button>
    `;
    
    examRunnerElement.appendChild(resultDiv);
}

renderExamRunner(exam);