export class Exam {
  constructor(title, description, category, code, durationMinutes, teacherId, id = null, createdAt = null, questions = []) {
    // if loading from storage use existing data. otherwise generate new data.
    this.id = id || crypto.randomUUID();
    this.createdAt = createdAt || new Date().toISOString();
    this.questions = questions; 
    
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