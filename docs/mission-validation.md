# Mission Validation

Phase 19 adds optional server-side scoring infrastructure without migrating lesson content.

## Table

`public.mission_validation` stores only minimal scoring keys:

- `mission_id`
- `activity_type`
- `validation_payload`
- `scoring_version`
- timestamps

Browser roles cannot read or write this table. Edge Functions use the service role path.

## Supported Activity Types

Only `multiple_choice` is supported in this phase.

Expected `validation_payload` shape:

```json
{
  "questions": [
    { "id": "q1", "correct": 0 }
  ]
}
```

The equivalent compact shape is also accepted:

```json
{
  "answerKey": {
    "q1": 0
  }
}
```

Submitted answers may be an object:

```json
{
  "q1": 0
}
```

Or an array:

```json
[
  { "id": "q1", "answer": 0 }
]
```

## Fallback

If no validation row exists for a mission/activity pair, `complete-mission` keeps the v1 frontend-trusted score model.

If validation data exists and answers are submitted, the Edge Function calculates the score server-side and ignores the submitted score.

Unsupported activity types are intentionally rejected when validation data exists, so bad validation configuration cannot silently fall back.
