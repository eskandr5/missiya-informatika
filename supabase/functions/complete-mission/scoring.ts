export interface MissionValidationRow {
  activity_type: string;
  validation_payload: unknown;
  scoring_version: string;
}

export interface ServerScoreResult {
  score: number;
  activityType: string;
  scoringVersion: string;
}

type AnswerKey = Map<string, number>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidChoiceIndex(value: unknown): value is number {
  return Number.isInteger(value) && value >= 0;
}

function readMultipleChoiceAnswerKey(payload: unknown): AnswerKey {
  if (!isRecord(payload)) {
    throw new Error('Invalid multiple_choice validation payload');
  }

  const answerKey = new Map<string, number>();
  const rawQuestions = payload.questions;

  if (Array.isArray(rawQuestions)) {
    for (const question of rawQuestions) {
      if (!isRecord(question)) continue;

      const id = typeof question.id === 'string' ? question.id.trim() : '';
      const correct = question.correct;

      if (id && isValidChoiceIndex(correct)) {
        answerKey.set(id, correct);
      }
    }
  }

  const rawAnswerKey = payload.answerKey;

  if (isRecord(rawAnswerKey)) {
    for (const [id, correct] of Object.entries(rawAnswerKey)) {
      if (id.trim() && isValidChoiceIndex(correct)) {
        answerKey.set(id.trim(), correct);
      }
    }
  }

  if (answerKey.size === 0) {
    throw new Error('multiple_choice validation payload has no answer key');
  }

  return answerKey;
}

function readSubmittedAnswers(answers: unknown): AnswerKey {
  if (isRecord(answers) && 'answers' in answers) {
    return readSubmittedAnswers(answers.answers);
  }

  const submitted = new Map<string, number>();

  if (isRecord(answers)) {
    for (const [id, answer] of Object.entries(answers)) {
      if (id.trim() && isValidChoiceIndex(answer)) {
        submitted.set(id.trim(), answer);
      }
    }
  } else if (Array.isArray(answers)) {
    for (const item of answers) {
      if (!isRecord(item)) continue;

      const idValue = item.id ?? item.questionId;
      const answerValue = item.answer ?? item.choiceIndex ?? item.selectedIndex;
      const id = typeof idValue === 'string' ? idValue.trim() : '';

      if (id && isValidChoiceIndex(answerValue)) {
        submitted.set(id, answerValue);
      }
    }
  }

  if (submitted.size === 0) {
    throw new Error('No scorable answers were submitted');
  }

  return submitted;
}

export function scoreMissionAnswers(
  validation: MissionValidationRow,
  answers: unknown,
): ServerScoreResult {
  if (validation.activity_type !== 'multiple_choice') {
    throw new Error(`Server scoring is not supported for ${validation.activity_type}`);
  }

  const answerKey = readMultipleChoiceAnswerKey(validation.validation_payload);
  const submittedAnswers = readSubmittedAnswers(answers);
  let correctCount = 0;

  for (const [questionId, correctAnswer] of answerKey) {
    if (submittedAnswers.get(questionId) === correctAnswer) {
      correctCount += 1;
    }
  }

  return {
    score: Math.round((correctCount / answerKey.size) * 100),
    activityType: validation.activity_type,
    scoringVersion: validation.scoring_version,
  };
}
