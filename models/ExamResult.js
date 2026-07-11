export class ExamResult {
  constructor(studentName, examId, examTitle, score, totalQuestions) {
    this.id = crypto.randomUUID();
    this.studentName = studentName;
    this.examId = examId;
    this.examTitle = examTitle;
    this.score = score;
    this.totalQuestions = totalQuestions;
    this.createdAt = new Date().toISOString();
  }

  getPercent() {
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  isPassed() {
    return this.getPercent() >= 60;
  }
}