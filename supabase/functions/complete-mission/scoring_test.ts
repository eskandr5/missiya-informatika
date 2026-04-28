import { scoreMissionAnswers } from './scoring.ts';

function assertEquals(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`Expected ${String(expected)}, received ${String(actual)}`);
  }
}

Deno.test('scores multiple_choice answers from object payloads', () => {
  const result = scoreMissionAnswers(
    {
      activity_type: 'multiple_choice',
      scoring_version: 'v1',
      validation_payload: {
        questions: [
          { id: 'q1', correct: 0 },
          { id: 'q2', correct: 2 },
          { id: 'q3', correct: 1 },
        ],
      },
    },
    {
      q1: 0,
      q2: 1,
      q3: 1,
    },
  );

  assertEquals(result.score, 67);
});

Deno.test('scores multiple_choice answers from array payloads', () => {
  const result = scoreMissionAnswers(
    {
      activity_type: 'multiple_choice',
      scoring_version: 'v1',
      validation_payload: {
        answerKey: {
          q1: 0,
          q2: 1,
        },
      },
    },
    [
      { id: 'q1', answer: 0 },
      { questionId: 'q2', choiceIndex: 1 },
    ],
  );

  assertEquals(result.score, 100);
});

Deno.test('rejects unsupported activity types', () => {
  try {
    scoreMissionAnswers(
      {
        activity_type: 'matching',
        scoring_version: 'v1',
        validation_payload: {},
      },
      {},
    );
  } catch (error) {
    assertEquals(error instanceof Error, true);
    return;
  }

  throw new Error('Expected unsupported activity type to throw');
});
