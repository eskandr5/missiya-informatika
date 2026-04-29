insert into public.mission_catalog (
  mission_id,
  module_id,
  module_order,
  mission_order,
  passing_score,
  xp_reward,
  implemented
)
values
  ('1-1', '1', 1, 1, 70, 60, true),
  ('1-2', '1', 1, 2, 70, 90, true),
  ('2-1', '2', 2, 1, 75, 60, true),
  ('2-2', '2', 2, 2, 80, 60, true),
  ('2-3', '2', 2, 3, 70, 90, true),
  ('3-1', '3', 3, 1, 75, 60, true),
  ('3-2', '3', 3, 2, 75, 60, true),
  ('3-3', '3', 3, 3, 80, 90, true),
  ('4-1', '4', 4, 1, 70, 70, true),
  ('4-2', '4', 4, 2, 70, 80, true),
  ('4-3', '4', 4, 3, 70, 90, true),
  ('4-4', '4', 4, 4, 70, 100, true),
  ('5-1', '5', 5, 1, 70, 60, true),
  ('5-2', '5', 5, 2, 70, 90, true),
  ('5-3', '5', 5, 3, 70, 100, true),
  ('5-4', '5', 5, 4, 70, 120, true),
  ('6-1', '6', 6, 1, 70, 60, true),
  ('6-2', '6', 6, 2, 70, 90, true),
  ('6-3', '6', 6, 3, 70, 120, true),
  ('7-1', '7', 7, 1, 70, 60, false),
  ('7-2', '7', 7, 2, 70, 90, false),
  ('8-1', '8', 8, 1, 70, 60, false),
  ('8-2', '8', 8, 2, 70, 90, false),
  ('9-1', '9', 9, 1, 70, 60, false),
  ('9-2', '9', 9, 2, 70, 90, false),
  ('10-1', '10', 10, 1, 70, 60, false),
  ('10-2', '10', 10, 2, 70, 90, false),
  ('11-1', '11', 11, 1, 70, 60, false),
  ('11-2', '11', 11, 2, 70, 90, false),
  ('12-1', '12', 12, 1, 70, 60, false),
  ('12-2', '12', 12, 2, 70, 90, false),
  ('12-3', '12', 12, 3, 80, 200, false)
on conflict (mission_id) do update set
  module_id = excluded.module_id,
  module_order = excluded.module_order,
  mission_order = excluded.mission_order,
  passing_score = excluded.passing_score,
  xp_reward = excluded.xp_reward,
  implemented = excluded.implemented,
  updated_at = now();

insert into public.checkpoint_catalog (
  checkpoint_id,
  order_index,
  after_module_id,
  before_module_id,
  passing_score,
  xp_reward
)
values
  ('checkpoint-1', 1, '3', '4', 70, 45)
on conflict (checkpoint_id) do update set
  order_index = excluded.order_index,
  after_module_id = excluded.after_module_id,
  before_module_id = excluded.before_module_id,
  passing_score = excluded.passing_score,
  xp_reward = excluded.xp_reward,
  updated_at = now();

insert into public.checkpoint_validation (
  checkpoint_id,
  activity_type,
  validation_payload,
  scoring_version
)
values
  (
    'checkpoint-1',
    'multiple_choice',
    '{
      "questions": [
        { "id": "cp1-q1", "correct": 0 },
        { "id": "cp1-q2", "correct": 1 },
        { "id": "cp1-q3", "correct": 1 },
        { "id": "cp1-q4", "correct": 2 },
        { "id": "cp1-q5", "correct": 0 },
        { "id": "cp1-q6", "correct": 1 }
      ]
    }'::jsonb,
    'v1'
  )
on conflict (checkpoint_id, activity_type, scoring_version) do update set
  validation_payload = excluded.validation_payload,
  updated_at = now();
