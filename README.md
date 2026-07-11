# Interactive Exam System

**Developer:** Ron Kfir (ID: 318677028)  
**Institution:** Tel-Hai College

## Project Description

The Interactive Exam System is a web-based platform for managing and taking exams. The system is built using a client-side architecture that applies Object-Oriented Programming (OOP) principles, a modular design (MVC-like architecture), and advanced utilization of LocalStorage for persistent data and state management[cite: 7, 8, 11, 14].

## Key Features

- **Authentication System:** Registration and login functionality that distinguishes between teacher and student roles, providing appropriate navigation and access rights[cite: 6].
- **Teacher Dashboard:**
  - Creation of new exams, including defining titles, codes, descriptions, categories, and durations[cite: 5, 11].
  - Dynamic addition of multiple-choice questions to specific exams[cite: 9, 13].
- **Student Dashboard:**
  - Search engine for locating exams by title or unique code[cite: 3].
  - Interactive exam execution and result persistence[cite: 2].
  - Viewable grade history and cumulative average calculation[cite: 4, 12].

## Implemented Bonus Features

- **Exam Timer:** Real-time countdown based on the exam duration, with automatic submission upon time expiry[cite: 11].
- **Review System:** Upon submission, answers are locked, and the system highlights correct answers and user mistakes for learning purposes[cite: 2].
- **Dark Mode:** Global toggle for switching between light and dark themes, with preference saved in LocalStorage to maintain consistency across navigation[cite: 8].

## Technology Stack and Architecture

The system was developed using vanilla JavaScript to demonstrate core competency in web development fundamentals:

- **HTML5 & CSS3:** Modern, responsive design using Bootstrap for layout structures[cite: 10, 15].
- **JavaScript (ES6):** Implementation of modules (export/import) to maintain clean code separation[cite: 6, 7].
- **Data Models:** Specialized classes for core objects (User, Exam, Question, ExamResult)[cite: 11, 12, 13, 14].
- **Services:** Classes managing business logic and data persistence (AuthService, ExamService, StorageService)[cite: 6, 7, 8].
- **UI Controllers:** Dedicated scripts for DOM manipulation per page (e.g., TeacherUI.js, StudentUI.js)[cite: 4, 5].

## Architecture

classDiagram
class User {
+UUID id
+string name
+string tz
+string password
+string role
}

    class Exam {
        +UUID id
        +string title
        +string description
        +string category
        +string code
        +int durationMinutes
        +UUID teacherId
        +addQuestion(Question q)
        +getQuestionCount()
    }

    class Question {
        +UUID id
        +string text
        +string[] answers
        +int correctAnswerIndex
        +isCorrect(int index)
    }

    class ExamResult {
        +UUID id
        +UUID studentId
        +UUID examId
        +int score
        +int totalQuestions
        +int[] answers
        +getPercent()
        +isPassed()
    }

    Exam "1" *-- "many" Question : contains
    ExamResult --> Exam : references
    User --> ExamResult : performs

![UML Diagram](./assets/diagram.png)
