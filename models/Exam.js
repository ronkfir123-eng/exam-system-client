export class Exam {
  constructor(title, description, category, code, durationMinutes, teacherId, id = null, createdAt = null, questions = []) {
    // If loading from storage, use existing data. Otherwise, generate new data.
    this.id = id || crypto.randomUUID();
    this.createdAt = createdAt || new Date().toISOString();
    this.questions = questions; 
    
    // Required fields from the project instructions
    this.title = title;
    this.description = description;
    this.category = category;
    this.code = code;
    this.durationMinutes = durationMinutes;
    this.teacherId = teacherId;
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  getQuestionCount() {
    return this.questions.length;
  }
}