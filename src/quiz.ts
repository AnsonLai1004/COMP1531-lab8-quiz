import HTTPError from 'http-errors';
import { Question, questionRemove } from './question';

interface Quiz {
  quizId: number,
  quizTitle: string,
  quizSynopsis: string,
  questions: Question[]
}

const state = {
  quizzes: [],
  quizIdCounter: 0
};

export function quizCreate(quizTitle: string, quizSynopsis: string): { quizId: number } {
  ensureNotEmpty(quizTitle, 'quizTitle');
  ensureNotEmpty(quizSynopsis, 'quizSynopsis');

  const quiz = {
    quizId: state.quizIdCounter++,
    quizTitle: quizTitle,
    quizSynopsis: quizSynopsis,
    questions: []
  };
  state.quizzes.push(quiz);

  return { quizId: quiz.quizId };
}

export function ensureNotEmpty(string: string, name: string) {
  if (string === '') {
    throw HTTPError(400, `${name} is an empty string`);
  }
}

export function quizDetails(quizId: number): { quiz: Quiz } {
  const quiz = ensureValidQuiz(quizId);
  return { quiz: quiz };
}

export function ensureValidQuiz(quizId: number): Quiz {
  const quiz = state.quizzes.find(quiz => quiz.quizId === quizId); 
  if (quiz === undefined) {
    throw HTTPError(400, 'quizId does not refer to a valid quiz');
  }
  return quiz;
}

export function quizEdit(quizId: number, quizTitle: string, quizSynopsis: string): Record<string, never> {
  const quiz = ensureValidQuiz(quizId);
  ensureNotEmpty(quizTitle, 'quizTitle');
  ensureNotEmpty(quizSynopsis, 'quizSynopsis');

  quizRemove(quizId);
  quiz.quizTitle = quizTitle;
  quiz.quizSynopsis = quizSynopsis;
  state.quizzes.push(quiz);

  return {};
}

export function quizRemove(quizId: number): Record<string, never> { 
  const quiz = ensureValidQuiz(quizId);
  state.quizzes.splice(state.quizzes.indexOf(quiz), 1);
  // Remove all the questions as well.
  for (const question of quiz.questions) {
    questionRemove(question.questionId);
  }

  return {};
}

interface QuizSummary {
  quizId: number,
  quizTitle: string,
}

export function quizzesList(): { quizzes: QuizSummary[] } {
  const quizzes = state.quizzes.map(toQuizSummary);
  // quizIds are monotonic.
  quizzes.sort((a: QuizSummary, b: QuizSummary) => a.quizId - b.quizId);
  return { quizzes: quizzes };
}

function toQuizSummary(quiz: Quiz): QuizSummary {
  return { quizId: quiz.quizId, quizTitle: quiz.quizTitle };
}

export function clear() {
  state.quizzes = [];
  state.quizIdCounter = 0;
}
