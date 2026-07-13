import { ExamService } from '../services/ExamService.js';
import { Question } from '../models/Question.js';
import { ExamResult } from '../models/ExamResult.js';
import StorageService from '../services/StorageService.js';

const examService = new ExamService();

// get Exam ID from URL
const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get('id');

if (!examId) {
    alert('Exam ID not found!');
    window.location.href = 'teacher-dashboard.html';
}

const currentExam = examService.getExamById(examId);

if (!currentExam) {
    alert('Exam not found!');
    window.location.href = 'teacher-dashboard.html';
}

// render Exam Details
document.getElementById('displayTitle').textContent = currentExam.title;
const examInfo = document.getElementById('examInfo');
if (examInfo) {
    examInfo.innerHTML = `
        <p><strong>Code:</strong> ${currentExam.code}</p>
        <p><strong>Description:</strong> ${currentExam.description}</p>
        <p><strong>Duration:</strong> ${currentExam.durationMinutes} minutes</p>
    `;
}

// render Questions
function renderQuestions() {
    const list = document.getElementById('questionsList');
    const count = document.getElementById('questionCount');
    
    if (list) list.innerHTML = '';
    if (count) count.textContent = currentExam.getQuestionCount();

    currentExam.questions.forEach((q, index) => {
        const li = document.createElement('li');
        let answersHtml = '<ul>';
        q.answers.forEach((ans, i) => {
            const isCorrect = (i === parseInt(q.correctAnswerIndex));
            answersHtml += `<li style="${isCorrect ? 'color: green; font-weight: bold;' : ''}">
                ${ans} ${isCorrect ? '(Correct)' : ''}
            </li>`;
        });
        answersHtml += '</ul>';

        li.innerHTML = `<strong>Question ${index + 1}: ${q.text}</strong>` + answersHtml;
        list.appendChild(li);
    });
}

// render Student Results
function renderStudentResults(examId) {
    const resultsTableBody = document.getElementById('resultsTableBody');
    const allResultsRaw = StorageService.getResults(); 
    const allUsers = StorageService.getUsers();

    if (!allResultsRaw || allResultsRaw.length === 0) {
        resultsTableBody.innerHTML = '<tr><td colspan="2">טרם בוצעו מבחנים</td></tr>';
        return;
    }

    resultsTableBody.innerHTML = '';
    
    allResultsRaw
        .filter(r => r.examId === examId)
        .forEach(r => {
            // create an ExamResult object from the raw data
            const result = new ExamResult(
                r.studentId, r.examId, r.examTitle, r.score, r.totalQuestions, r.answers, r.id, r.createdAt
            );

            // log the result object to the console for debugging
            console.log("Checking object:", result);

            // find the student name based on studentId
            const student = allUsers.find(u => u.id === result.studentId);
            const studentName = student ? student.name : 'משתמש לא ידוע';
            
            // calculate the percentage score
            const percent = (typeof result.getPercent === 'function') 
                ? result.getPercent() 
                : Math.round((result.score / result.totalQuestions) * 100);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${studentName}</td>
                <td>${result.totalQuestions} / ${result.score} (${percent}%)</td>
            `;
            resultsTableBody.appendChild(row);
        });
}

// initial renders
renderQuestions();
renderStudentResults(examId);

// add question logic
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
        
        const correctRadio = document.querySelector('input[name="correct"]:checked');
        if (!correctRadio) {
            alert('Please select the correct answer.');
            return;
        }
        const correctIndex = parseInt(correctRadio.value);

        const newQuestion = new Question(text, answers, correctIndex);
        currentExam.addQuestion(newQuestion);
        examService.updateExam(currentExam);
        
        renderQuestions();
        e.target.reset(); 
    });
}