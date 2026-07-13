import { AuthService } from '../services/AuthService.js';
import StorageService from '../services/StorageService.js';
import { ExamResult } from '../models/ExamResult.js';

// only allow students to access this page
const currentUser = AuthService.getLoggedInUser();
if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'login.html';
}

// show student name and role
document.getElementById('welcomeMessage').textContent = `שלום, ${currentUser.name} (סטודנט/ית)`;

document.getElementById('logoutBtn').addEventListener('click', () => {
    AuthService.logout();
});

// load the student's exam history and average score
function loadDashboard() {
    const historyList = document.getElementById('historyList');
    const avgDisplay = document.getElementById('avgScore');

    // get all exam results from storage
    const allResultsRaw = StorageService.getResults();
    
    // filter results for the current student and create ExamResult instances
    const myResults = allResultsRaw
        .filter(result => result.studentId === currentUser.id)
        .map(resultData => new ExamResult(
            resultData.studentId, 
            resultData.examId, 
            resultData.examTitle, 
            resultData.score, 
            resultData.totalQuestions, 
            resultData.answers, 
            resultData.id, 
            resultData.createdAt
        ));

    // no tests taken yet
    if (myResults.length === 0) {
        historyList.innerHTML = '<li>טרם ביצעת מבחנים במערכת.</li>';
        avgDisplay.textContent = 'ממוצע ציונים: אין נתונים';
        return;
    }

    let totalPercent = 0;
    historyList.innerHTML = ''; // clear previous history

    // render each result
    myResults.forEach(result => {
        const percent = result.getPercent();
        totalPercent += percent;
        
        const isPassed = result.isPassed();
        
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${result.examTitle}</strong> - ציון: ${percent}% 
            <span style="color: ${isPassed ? 'green' : 'red'}; font-weight: bold;">
                (${isPassed ? 'עובר' : 'נכשל'})
            </span>
            <br>
            <small>תאריך: ${new Date(result.createdAt).toLocaleDateString('he-IL')}</small>
        `;
        historyList.appendChild(li);
    });

    // calculate and display average score
    const avg = Math.round(totalPercent / myResults.length);
    avgDisplay.textContent = `ממוצע ציונים: ${avg}%`;
}

// load the dashboard on page reload
loadDashboard();