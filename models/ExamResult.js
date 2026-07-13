export class ExamResult {
  constructor(studentId, examId, examTitle, score, totalQuestions, answers = [], id = null, createdAt = null) {

    this.id = id || crypto.randomUUID();
    this.createdAt = createdAt || new Date().toISOString();
    
    // core data
    this.studentId = studentId;
    this.examId = examId;
    this.examTitle = examTitle;
    this.score = score;
    this.totalQuestions = totalQuestions;
    this.answers = answers;
  }

  getPercent() {
    if (this.totalQuestions === 0) return 0;
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  isPassed() {
    return this.getPercent() >= 60;
  }
}