export class ExamResult {
  constructor(studentId, examId, examTitle, score, totalQuestions, answers = [], id = null, createdAt = null) {

    this.id = id || crypto.randomUUID();
    this.createdAt = createdAt || new Date().toISOString();
    
    // Core data
    this.studentId = studentId; // Crucial for filtering the dashboard
    this.examId = examId;
    this.examTitle = examTitle;
    this.score = score;
    this.totalQuestions = totalQuestions;
    this.answers = answers; // Array of the user's chosen options
  }

  getPercent() {
    if (this.totalQuestions === 0) return 0; // Safety check
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  isPassed() {
    return this.getPercent() >= 60;
  }
}