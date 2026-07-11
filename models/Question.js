export class Question {
  constructor(text, answers, correctAnswerIndex , id = null) {
    this.id = id ||crypto.randomUUID();
    this.text = text;
    this.answers = answers;
    this.correctAnswerIndex = correctAnswerIndex;
  }

  isCorrect(userAnswerIndex) {
    return userAnswerIndex === this.correctAnswerIndex;
  }
}