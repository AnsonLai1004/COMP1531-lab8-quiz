import HTTPError from 'http-errors';
import { ensureNotEmpty, ensureValidQuiz } from './quiz';

const questionTypes = ['single', 'multiple'];
type QuestionType = typeof questionTypes[number];

interface Answer {
  isCorrect: boolean,
  answerString: string
}

export interface Question {
  questionId: number,
  questionString: string,
  questionType: QuestionType,
  answers: Answer[]
}

const state = {
  questionIdToQuiz: new Map(),
  questionIdCounter: 0
};

export function questionAdd(quizId: number, questionString: string, questionType: QuestionType, answers: Answer[]): {
  questionId: number
} {
  ensureValidQuestionRequest(quizId, questionString, questionType, answers);

  const quiz = ensureValidQuiz(quizId);
  const question = {
    questionId: state.questionIdCounter++,
    questionString: questionString,
    questionType: questionType,
    answers: answers
  };
  quiz.questions.push(question);
  state.questionIdToQuiz.set(question.questionId, quiz);

  return { questionId: question.questionId };
}

function ensureValidQuestionRequest(quizId: number, questionString: string, questionType: QuestionType, answers: Answer[]) {
  ensureValidQuiz(quizId);
  ensureNotEmpty(questionString, 'questionString');
  ensureQuestionType(questionType);
  if (questionType === 'single') {
    ensureOneCorrectAnswer(answers);
  } else {
    ensureSomeCorrectAnswer(answers);
  }
  for (const answer of answers) {
    ensureNotEmpty(answer.answerString, 'any of the answerString');
  }
}

function ensureQuestionType(questionType: QuestionType) { 
  if (questionTypes.indexOf(questionType) === -1) {
    throw HTTPError(400, 'questionType is not either "single" or "multiple"');
  }
}

function ensureOneCorrectAnswer(answers: Answer[]) {
  if (answers.filter(answer => answer.isCorrect).length !== 1) {
    throw HTTPError(400, 'the questionType is "single" and there is not exactly 1 correct answer');
  }
}

function ensureSomeCorrectAnswer(answers: Answer[]) {
  if (!answers.some(answer => answer.isCorrect)) {
    throw HTTPError(400, 'there are no correct answers');
  }
}

export function questionEdit(questionId: number, questionString: string, questionType: QuestionType, answers: Answer[]): Record<string, never> {
  const quiz = state.questionIdToQuiz.get(questionId);
  // In order to reuse ensureValidQuestionRequest, we need a dummy quizId to verify.
  const quizId = quiz.quizId;
  ensureValidQuestionRequest(quizId, questionString, questionType, answers);
  const question = ensureValidQuestion(questionId);

  questionRemove(questionId);
  question.questionString = questionString;
  question.questionType = questionType;
  question.answers = answers;
  quiz.questions.push(question);

  return {};
}

function ensureValidQuestion(questionId: number): Question {
  const quiz = state.questionIdToQuiz.get(questionId);
  if (quiz === undefined) {
    throw HTTPError(400, 'questionId does not refer to a valid question');
  }
  // If there is an entry in state.questionIdToQuiz, the question must
  // exist in the quiz.
  const question = quiz.questions.find((question: Question) => question.questionId === questionId);

  return question;
}

export function questionRemove(questionId: number): Record<string, never> {
  const quiz = state.questionIdToQuiz.get(questionId);
  const question = ensureValidQuestion(questionId);
  quiz.questions.splice(quiz.questions.indexOf(question));
  state.questionIdToQuiz.delete(questionId);

  return {};
}

export function clear() {
  state.questionIdToQuiz = new Map();
  state.questionIdCounter = 0;
}
