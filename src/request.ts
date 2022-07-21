import request from 'sync-request';
import { SERVER_URL } from './config';
import { answers } from './quiz';

export function reqQuizCreate(quizTitle: string, quizSynopsis: string) {
  const res = request(
    'POST',
    SERVER_URL + '/quiz/create',
    {
      json: {
        quizTitle,
        quizSynopsis,
      }
    }
  );
  return JSON.parse(res.getBody() as string);
}

export function reqQuizDetails(quizId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/quiz/details',
    {
      qs: {
        quizId,
      }
    }
  );
  return JSON.parse(res.getBody() as string);
}

export function reqQuizEdit(quizId: number, quizTitle: string, quizSynopsis: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/quiz/edit',
    {
      json: {
        quizId,
        quizTitle,
        quizSynopsis,
      }
    }
  );
  return JSON.parse(res.getBody() as string);
}

export function reqQuizRemove(quizId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + '/quiz/remove',
    {
      qs: {
        quizId,
      }
    }
  );
  return JSON.parse(res.getBody() as string);
}

export function reqQuizzesList() {
  const res = request(
    'GET',
    SERVER_URL + '/quizzes/list',
    {}
  );
  return JSON.parse(res.getBody() as string);
}

export function reqQuestionAdd(quizId: number, questionString: string, questionType: string, answers: answers[]) {
  const res = request(
    'POST',
    SERVER_URL + '/question/add',
    {
      json: {
        quizId,
        questionString,
        questionType,
        answers,
      }
    }
  );
  return JSON.parse(res.getBody() as string);
}

export function reqQuestionEdit(questionId: number, questionString: string, questionType: string, answers: answers[]) {
  const res = request(
    'POST',
    SERVER_URL + '/question/edit',
    {
      json: {
        questionId,
        questionString,
        questionType,
        answers,
      }
    }
  );
  return JSON.parse(res.getBody() as string);
}

export function reqQuestionRemove(questionId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + '/question/remove',
    {
      qs: {
        questionId,
      }
    }
  );
  return JSON.parse(res.getBody() as string);
}

export function reqClear() {
  const res = request(
    'DELETE',
    SERVER_URL + '/clear',
    {}
  );
  return JSON.parse(res.getBody() as string);
}
