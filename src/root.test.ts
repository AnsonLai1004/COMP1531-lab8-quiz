import request from 'sync-request';
import {
  reqQuizCreate, reqQuizDetails, reqQuizEdit, reqQuizRemove, reqQuizzesList,
  reqQuestionAdd, reqQuestionEdit, reqQuestionRemove, reqClear
} from './request';
import { SERVER_URL } from './config';

beforeEach(() => {
  reqClear();
});

test('success root', () => {
  const res = request(
    'GET',
    SERVER_URL + '/',

    // Not necessary, since it's empty, though reminder that
    // GET/DELETE is `qs`, PUT/POST is `json`
    { qs: {} }
  );
  expect(res.statusCode).toEqual(200);
  const data = JSON.parse(res.getBody() as string);
  expect(data).toStrictEqual({ message: expect.any(String) });
});

describe('/quiz/create', () => {
  test('invalid quizTitle or quizSynopsis', () => {
    expect(() => reqQuizCreate('', 'valid')).toThrowError('empty string');
    expect(() => reqQuizCreate('valid', '')).toThrowError('empty string');
  });
  test('correct return', () => {
    const quiz = reqQuizCreate('first', 'valid');
    const quiz2 = reqQuizCreate('second', 'valid');
    expect(reqQuizDetails(quiz.quizId)).toMatchObject({
      quizId: quiz.quizId,
      quizTitle: 'first',
      quizSynopsis: 'valid',
      questions: [],
    });
    expect(reqQuizzesList()).toMatchObject([
      {
        quizId: quiz.quizId,
        quizTitle: 'first',
      },
      {
        quizId: quiz2.quizId,
        quizTitle: 'second',
      },
    ]);
  });
});

describe('/quiz/details', () => {
  test('invalid quizId', () => {
    expect(() => reqQuizDetails(-999)).toThrowError('invalid quizId');
  });
  test('correct return', () => {
    const quiz = reqQuizCreate('first', 'valid');
    const quiz2 = reqQuizCreate('second', 'valid');
    expect(reqQuizDetails(quiz.quizId)).toMatchObject({
      quizId: quiz.quizId,
      quizTitle: 'first',
      quizSynopsis: 'valid',
      questions: [],
    });
    expect(reqQuizDetails(quiz2.quizId)).toMatchObject({
      quizId: quiz2.quizId,
      quizTitle: 'second',
      quizSynopsis: 'valid',
      questions: [],
    });
    
  });
});

describe('/quiz/edit', () => {
  test('invalid input', () => {
    const quiz = reqQuizCreate('first', 'valid');
    expect(() => reqQuizEdit(-999, 'valid', 'valid')).toThrowError('invalid quizId');
    expect(() => reqQuizEdit(quiz.quizId, '', 'valid')).toThrowError('empty string');
    expect(() => reqQuizEdit(quiz.quizId, 'valid', '')).toThrowError('empty string');
  });
  test('correct return', () => {
    const quiz = reqQuizCreate('first', 'valid');
    const quiz2 = reqQuizCreate('second', 'valid');
    expect(reqQuizDetails(quiz2.quizId)).toMatchObject({
      quizId: quiz2.quizId,
      quizTitle: 'second',
      quizSynopsis: 'valid',
      questions: [],
    });
    reqQuizEdit(quiz2.quizId, 'edit', 'edit');
    expect(reqQuizDetails(quiz2.quizId)).toMatchObject({
      quizId: quiz2.quizId,
      quizTitle: 'edit',
      quizSynopsis: 'edit',
      questions: [],
    });
    expect(reqQuizzesList()).toMatchObject([
      {
        quizId: quiz.quizId,
        quizTitle: 'first',
      },
      {
        quizId: quiz2.quizId,
        quizTitle: 'edit',
      },
    ]);
  });
});

describe('/quiz/remove', () => {
  test('invalid input', () => {
    expect(() => reqQuizRemove(-999)).toThrowError('invalid quizId');
  });
  test('correct return', () => {
    const quiz = reqQuizCreate('first', 'valid');
    expect(reqQuizzesList()).toMatchObject([
      {
        quizId: quiz.quizId,
        quizTitle: 'first',
      },
    ]);
    reqQuizRemove(quiz.quizId);
    expect(reqQuizzesList()).toMatchObject([]);
  });
});

describe('/quizzes/list', () => {
  /* test('invalid input', () => {
    expect(() => reqQuiz).toThrowError(400);
  }); */
  test('correct return', () => {
    const quiz = reqQuizCreate('first', 'valid');
    const quiz2 = reqQuizCreate('second', 'valid');
    expect(reqQuizzesList()).toMatchObject([
      {
        quizId: quiz.quizId,
        quizTitle: 'first',
      },
      {
        quizId: quiz2.quizId,
        quizTitle: 'second',
      },
    ]);
  });
});

describe('/question/add', () => {
  test('invalid input', () => {
    const quiz = reqQuizCreate('first', 'valid');
    const answers = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: true,
        answerString: 'wrong ans',
      },
    ];
    const emptyStr = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: false,
        answerString: '',
      },
    ];
    const noAns = [
      {
        isCorrect: false,
        answerString: 'correct ans',
      },
      {
        isCorrect: false,
        answerString: 'fdfdfd',
      },
    ];
    expect(() => reqQuestionAdd(-999, 'first', 'single', answers)).toThrowError('invalid quizId');
    expect(() => reqQuestionAdd(quiz.quizId, '', 'single', answers)).toThrowError('empty string or invalid questionType');
    expect(() => reqQuestionAdd(quiz.quizId, 'first', 'invalid', answers)).toThrowError('empty string or invalid questionType');
    expect(() => reqQuestionAdd(quiz.quizId, 'first', 'single', answers)).toThrowError('not exactly 1 correct answer with single type');
    expect(() => reqQuestionAdd(quiz.quizId, 'first', 'single', emptyStr)).toThrowError('empty answerString');
    expect(() => reqQuestionAdd(quiz.quizId, 'first', 'single', noAns)).toThrowError('no correct answers');
  });
  test('correct return', () => {
    const quiz1 = reqQuizCreate('beforeFirst', 'valid');
    const quiz = reqQuizCreate('first', 'valid');
    expect(reqQuizzesList()).toMatchObject([
      {
        quizId: quiz1.quizId,
        quizTitle: 'beforeFirst',
      },
      {
        quizId: quiz.quizId,
        quizTitle: 'first',
      },
    ]);
    const singleAns = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: false,
        answerString: 'wrong ans',
      },
    ];
    const multipleAns = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: true,
        answerString: 'correct ans too',
      },
    ];
    const question = reqQuestionAdd(quiz.quizId, 'question1', 'single', singleAns);
    const question2 = reqQuestionAdd(quiz.quizId, 'question2', 'multiple', multipleAns);
    expect(reqQuizDetails(quiz.quizId)).toMatchObject({
      quizId: quiz.quizId,
      quizTitle: 'first',
      quizSynopsis: 'valid',
      questions: [
        {
          questionId: question.questionId,
          questionString: 'question1',
          questionType: 'single',
          answers: [
            {
              isCorrect: true,
              answerString: 'correct ans',
            },
            {
              isCorrect: false,
              answerString: 'wrong ans',
            },
          ],
        },
        {
          questionId: question2.questionId,
          questionString: 'question2',
          questionType: 'multiple',
          answers: [
            {
              isCorrect: true,
              answerString: 'correct ans',
            },
            {
              isCorrect: true,
              answerString: 'correct ans too',
            },
          ],
        },
      ],
    });
  });
});

describe('/question/edit', () => {
  test('invalid input', () => {
    const quiz = reqQuizCreate('first', 'valid');
    const singleAns = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: false,
        answerString: 'wrong ans',
      },
    ];
    const multipleAns = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: true,
        answerString: 'wrong ans',
      },
    ];
    const emptyStr = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: false,
        answerString: '',
      },
    ];
    const noAns = [
      {
        isCorrect: false,
        answerString: 'correct ans',
      },
      {
        isCorrect: false,
        answerString: 'correct ans',
      },
    ];
    const question = reqQuestionAdd(quiz.quizId, 'question1', 'single', singleAns);
    expect(() => reqQuestionEdit(-999, 'edit', 'single', singleAns)).toThrowError('invalid questionId');
    expect(() => reqQuestionEdit(question.questionId, '', 'single', singleAns)).toThrowError('empty string or invalid questionType');
    expect(() => reqQuestionEdit(question.questionId, 'edit', 'invalid', singleAns)).toThrowError('empty string or invalid questionType');
    expect(() => reqQuestionEdit(question.questionId, 'edit', 'single', multipleAns)).toThrowError('not exactly 1 correct answer with single type');
    expect(() => reqQuestionEdit(question.questionId, 'edit', 'single', emptyStr)).toThrowError('empty answerString');
    expect(() => reqQuestionEdit(question.questionId, 'edit', 'single', noAns)).toThrowError('no correct answers');
  });
  test('correct return', () => {
    const quiz1 = reqQuizCreate('beforeFirst', 'valid');
    const quiz = reqQuizCreate('first', 'valid');
    expect(reqQuizzesList()).toMatchObject([
      {
        quizId: quiz1.quizId,
        quizTitle: 'beforeFirst',
      },
      {
        quizId: quiz.quizId,
        quizTitle: 'first',
      },
    ]);
    const singleAns = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: false,
        answerString: 'wrong ans',
      },
    ];
    const question1 = reqQuestionAdd(quiz.quizId, 'question1', 'multiple', singleAns);
    const question = reqQuestionAdd(quiz.quizId, 'question2', 'single', singleAns);
    const editAns = [
      {
        isCorrect: true,
        answerString: 'edit',
      },
      {
        isCorrect: false,
        answerString: 'edit2',
      },
    ];
    expect(reqQuestionEdit(question.questionId, 'edit', 'single', editAns)).toStrictEqual({});
    expect(reqQuestionEdit(question.questionId, 'edit', 'multiple', editAns)).toStrictEqual({});
    expect(reqQuizDetails(quiz.quizId)).toMatchObject({
      quizId: quiz.quizId,
      quizTitle: 'first',
      quizSynopsis: 'valid',
      questions: [
        {
          questionId: question1.questionId,
          questionString: 'question1',
          questionType: 'multiple',
          answers: [
            {
              isCorrect: true,
              answerString: 'correct ans',
            },
            {
              isCorrect: false,
              answerString: 'wrong ans',
            },
          ],
        },
        {
          questionId: question.questionId,
          questionString: 'edit',
          questionType: 'multiple',
          answers: [
            {
              isCorrect: true,
              answerString: 'edit',
            },
            {
              isCorrect: false,
              answerString: 'edit2',
            },
          ],
        },
      ],
    });
  });
});

describe('/question/remove', () => {
  test('invalid input', () => {
    expect(() => reqQuestionRemove(-999)).toThrowError('invalid questionId');
  });
  test('correct return', () => {
    const quiz = reqQuizCreate('first', 'valid');
    const singleAns = [
      {
        isCorrect: true,
        answerString: 'correct ans',
      },
      {
        isCorrect: false,
        answerString: 'wrong ans',
      },
    ];
    const question1 = reqQuestionAdd(quiz.quizId, 'questionfirst', 'single', singleAns);
    const question = reqQuestionAdd(quiz.quizId, 'question1', 'single', singleAns);
    expect(reqQuestionRemove(question.questionId)).toStrictEqual({});
    expect(reqQuizDetails(quiz.quizId)).toMatchObject({
      quizId: quiz.quizId,
      quizTitle: 'first',
      quizSynopsis: 'valid',
      questions: [],
    });
    reqQuestionRemove(question1.questionId);
  });
});

expect(false).toEqual(false);