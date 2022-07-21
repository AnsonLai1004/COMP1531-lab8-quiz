import httpError from 'http-errors';

interface answers {
    isCorrect: boolean;
    answerString: string;
}

interface questions {
    questionId: number;
    questionString: string;
    questionType: string;
    answers: answers[];
}

interface quiz {
    quizId: number;
    quizTitle: string;
    quizSynopsis: string;
    questions: number[];
}
/*
interface quizzes {
    quizId: number;
    quizTitle: string;
}
*/
let Quiz: quiz[] = [];
let Question: questions[] = [];
function quizCreate(quizTitle: string, quizSynopsis: string) {
  if (quizTitle === '' || quizSynopsis === '') {
    throw httpError(400, 'empty string');
  }
  let newId;
  if (Quiz.length === 0) {
    newId = 1;
  } else {
    newId = Quiz[Quiz.length - 1].quizId + 1;
  }
  const q = {
    quizId: newId,
    quizTitle: quizTitle,
    quizSynopsis: quizSynopsis,
    questions: [] as number[],
  };
  Quiz.push(q);
  return { quizId: newId };
}
// change
function quizDetails(quizId: number) {
  for (const q of Quiz) {
    if (q.quizId === quizId) {
      const qArr = createQuestionsArr(q.questions);
      return {
        quizId: q.quizId,
        quizTitle: q.quizTitle,
        quizSynopsis: q.quizSynopsis,
        questions: qArr,
      };
    }
  }
  throw httpError(400, 'invalid quizId');
}

function quizEdit(quizId: number, quizTitle: string, quizSynopsis: string) {
  if (quizTitle === '' || quizSynopsis === '') {
    throw httpError(400, 'empty string');
  }
  if (!isValidQuiz(quizId)) {
    throw httpError(400, 'invalid quizId');
  }
  for (const q of Quiz) {
    if (quizId === q.quizId) {
      q.quizTitle = quizTitle;
      q.quizSynopsis = quizSynopsis;
      return {};
    }
  }
}

function quizRemove(quizId: number) {
  if (!isValidQuiz(quizId)) {
    throw httpError(400, 'invalid quizId');
  }
  Quiz = Quiz.filter(data => data.quizId !== quizId);
  return {};
}

function quizzesList() {
  const result = [];
  for (const q of Quiz) {
    result.push({
      quizId: q.quizId,
      quizTitle: q.quizTitle,
    });
  }
  return result;
}

function questionAdd(quizId: number, questionString: string, questionType: string, answers: answers[]) {
  if (!isValidQuiz(quizId)) {
    throw httpError(400, 'invalid quizId');
  }
  if (questionString === '' || !isValidQuestionType(questionType)) {
    throw httpError(400, 'empty string or invalid questionType');
  }
  // check correct answer exist, check answerString is not empty
  const correctAns = answers.filter(data => data.isCorrect === true);
  if (correctAns.length < 1) {
    throw httpError(400, 'no correct answers');
  }
  // if single, 1 correct answer
  if (questionType === 'single') {
    const correctAns = answers.filter(data => data.isCorrect === true);
    if (correctAns.length !== 1) {
      throw httpError(400, 'not exactly 1 correct answer with single type');
    }
  }

  // empty answerString
  for (const ans of answers) {
    if (ans.answerString === '') {
      throw httpError(400, 'empty answerString');
    }
  }
  // add question
  let newId;
  if (Question.length === 0) {
    newId = 1;
  } else {
    newId = Question[Question.length - 1].questionId + 1;
  }
  const question = {
    questionId: newId,
    questionString: questionString,
    questionType: questionType,
    answers: answers,
  };
  Question.push(question);

  for (const q of Quiz) {
    if (quizId === q.quizId) {
      q.questions.push(newId);
      return { questionId: newId };
    }
  }
}

function questionEdit(questionId: number, questionString: string, questionType: string, answers: answers[]) {
  if (!isValidQuestionId(questionId)) {
    throw httpError(400, 'invalid questionId');
  }
  if (questionString === '' || !isValidQuestionType(questionType)) {
    throw httpError(400, 'empty string or invalid questionType');
  }
  // empty answerString
  for (const ans of answers) {
    if (ans.answerString === '') {
      throw httpError(400, 'empty answerString');
    }
  }
  // check correct answer exist, check answerString is not empty
  const correctAns = answers.filter(data => data.isCorrect === true);
  if (correctAns.length < 1) {
    throw httpError(400, 'no correct answers');
  }
  // if single, 1 correct answer
  if (questionType === 'single') {
    const correctAns = answers.filter(data => data.isCorrect === true);
    if (correctAns.length !== 1) {
      throw httpError(400, 'not exactly 1 correct answer with single type');
    }
  }

  for (const q of Question) {
    if (questionId === q.questionId) {
      q.questionString = questionString;
      q.questionType = questionType;
      q.answers = answers;
      return {};
    }
  }
}

function questionRemove(questionId: number) {
  if (!isValidQuestionId(questionId)) {
    throw httpError(400, 'invalid questionId');
  }
  for (const quiz of Quiz) {
    for (let i = 0; i < quiz.questions.length; i++) {
      if (quiz.questions[i] === questionId) {
        quiz.questions.splice(0, i);
      }
    }
  }
  Question = Question.filter(data => data.questionId !== questionId);
  return {};
}
function clear() {
  Quiz = [];
  Question = [];
  return {};
}

/// //////////////////////////////Helper functions//////////////////////////////////////////

function isValidQuiz(quizId: number) {
  for (const q of Quiz) {
    if (quizId === q.quizId) {
      return true;
    }
  }
  return false;
}

function isValidQuestionType(questionType: string) {
  if (questionType === 'single' || questionType === 'multiple') {
    return true;
  }
  return false;
}

function isValidQuestionId(questionId: number) {
  for (const q of Question) {
    if (q.questionId === questionId) {
      return true;
    }
  }
  return false;
}

function createQuestionsArr(questions: number[]) {
  const result = [];
  for (const id of questions) {
    for (const q of Question) {
      if (id === q.questionId) {
        result.push(q);
      }
    }
  }
  return result;
}
// console.log(quizEdit(-999,'valid', 'valid'))
export { answers, quizCreate, quizDetails, quizEdit, quizRemove, quizzesList, questionAdd, questionEdit, questionRemove, clear };
