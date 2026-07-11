import { AuthService } from '../services/AuthService.js';
import StorageService from '../services/StorageService.js';
import { ExamResult } from '../models/ExamResult.js';

// 1. אבטחה: נוודא שרק סטודנט יכול לגשת לכאן
const currentUser = AuthService.getLoggedInUser();
if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'login.html';
}

// 2. הצגת שם הסטודנט והתנתקות
document.getElementById('welcomeMessage').textContent = `שלום, ${currentUser.name} (סטודנט/ית)`;

document.getElementById('logoutBtn').addEventListener('click', () => {
    AuthService.logout();
});

// 3. טעינת היסטוריית המבחנים
function loadDashboard() {
    const historyList = document.getElementById('historyList');
    const avgDisplay = document.getElementById('avgScore');

    // שליפת כל התוצאות מה-Storage
    const allResultsRaw = StorageService.getResults();
    
    // סינון רק של התוצאות של הסטודנט הנוכחי + יצירת אובייקטי ExamResult אמיתיים (Rehydration)
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

    // אם הסטודנט עדיין לא עשה מבחנים
    if (myResults.length === 0) {
        historyList.innerHTML = '<li>טרם ביצעת מבחנים במערכת.</li>';
        avgDisplay.textContent = 'ממוצע ציונים: אין נתונים';
        return;
    }

    let totalPercent = 0;
    historyList.innerHTML = ''; // ניקוי הרשימה

    // מעבר על כל תוצאה והצגתה
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

    // חישוב והצגת הממוצע
    const avg = Math.round(totalPercent / myResults.length);
    avgDisplay.textContent = `ממוצע ציונים: ${avg}%`;
}

// הפעלת הפונקציה כשהדף עולה
loadDashboard();