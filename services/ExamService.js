import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";

export class ExamService {
  constructor() {
    this.storageKey = "exams";
  }

  getAllExams() {
    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return [];
    }

    const plainExams = JSON.parse(data);

    return plainExams.map(examData => {
      // pass all fields to the constructor based on Exam.js
      const exam = new Exam(
        examData.title,
        examData.description,
        examData.category,
        examData.code,
        examData.durationMinutes,
        examData.teacherId,
        examData.id,
        examData.createdAt
      );

      exam.questions = examData.questions.map(questionData => {
        return new Question(
          questionData.text,
          questionData.answers,
          questionData.correctAnswerIndex,
          questionData.id // pass the id so it doesn't generate a new one
        );
      });

      return exam;
    });
  }

  saveExam(exam) {
    const exams = this.getAllExams();
    exams.push(exam);
    localStorage.setItem(this.storageKey, JSON.stringify(exams));
  }

  deleteExam(examId) {
    const exams = this.getAllExams();
    const filteredExams = exams.filter(exam => exam.id !== examId);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredExams));
  }

  getExamById(examId) {
    const exams = this.getAllExams();
    return exams.find(exam => exam.id === examId);
  }

  getExamsByTeacher(teacherId) {
    const exams = this.getAllExams();
    return exams.filter(exam => exam.teacherId === teacherId);
  }

  updateExam(updatedExam) {
    const exams = this.getAllExams();
    const index = exams.findIndex(exam => exam.id === updatedExam.id);
    
    if (index !== -1) {
      exams[index] = updatedExam; // replace the old version with the updated one
      localStorage.setItem(this.storageKey, JSON.stringify(exams));
    }
  }

  saveImportedExam(examData) {
    // create a new Exam instance from the imported data
    const importedExam = new Exam(
        examData.title,
        examData.description,
        examData.category,
        examData.code,
        examData.durationMinutes,
        examData.teacherId, // keep the original teacherId
        examData.id,
        examData.createdAt
    );

    // get questions from imported data
    if (examData.questions) {
        importedExam.questions = examData.questions.map(q => new Question(q.text, q.answers, q.correctAnswerIndex, q.id));
    }

    this.saveExam(importedExam);
}
  clearAllExams() {
    localStorage.removeItem(this.storageKey);
  }
}