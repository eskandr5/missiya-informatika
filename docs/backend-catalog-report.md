# Backend Catalog Report

Phase executed: `Phase 0` only from `backend-plan-mission-informatics-final.md`

Status:
- Frontend data inspected
- Catalog extracted
- No Supabase setup started
- No auth integration started
- No progress logic changed
- No frontend source files modified in this phase

## Initial Rank

Current frontend rank file does not contain stable rank IDs yet.

Proposed initial rank ID for backend v1:

```txt
initial_rank_id: rank_01
```

## Ranks

Current source: `src/data/ranks.ts`

Proposed stable IDs, ordered by ascending `minXP`:

| proposed_rank_id | current_name | current_en | min_xp |
|---|---|---|---:|
| rank_01 | Оператор-1 | Operator-1 | 0 |
| rank_02 | Оператор-2 | Operator-2 | 150 |
| rank_03 | Аналитик | Analyst | 400 |
| rank_04 | Архивист | Archivist | 900 |

## Modules

| module_id | module_order | title | badge_id | module_xp_reward | mission_count | mission_xp_sum |
|---|---:|---|---|---:|---:|---:|
| 1 | 1 | Информатика как наука | explorer | 150 | 2 | 150 |
| 2 | 2 | Компьютер и устройства | engineer | 150 | 3 | 210 |
| 3 | 3 | Файлы и папки | organizer | 180 | 3 | 210 |
| 4 | 4 | Данные, графика и звук | creator | 150 | 4 | 340 |
| 5 | 5 | Системы счисления: основы | mathematician | 150 | 4 | 370 |
| 6 | 6 | Арифметика и связь систем | calculator | 150 | 3 | 270 |
| 7 | 7 | Алгебра логики | logician | 150 | 2 | 150 |
| 8 | 8 | Понятие алгоритма | algorithmist | 150 | 2 | 150 |
| 9 | 9 | Графический язык алгоритмов | designer | 150 | 2 | 150 |
| 10 | 10 | Алгоритмический язык | coder | 150 | 2 | 150 |
| 11 | 11 | Языки программирования | programmer | 150 | 2 | 150 |
| 12 | 12 | Ветвления, циклы и финальная миссия | graduate | 200 | 3 | 350 |

## Missions

| mission_id | module_id | module_order | mission_order | passing_score | xp_reward | implemented |
|---|---|---:|---:|---:|---:|---|
| 1-1 | 1 | 1 | 1 | 70 | 60 | true |
| 1-2 | 1 | 1 | 2 | 70 | 90 | true |
| 2-1 | 2 | 2 | 1 | 75 | 60 | true |
| 2-2 | 2 | 2 | 2 | 80 | 60 | true |
| 2-3 | 2 | 2 | 3 | 70 | 90 | true |
| 3-1 | 3 | 3 | 1 | 75 | 60 | true |
| 3-2 | 3 | 3 | 2 | 75 | 60 | true |
| 3-3 | 3 | 3 | 3 | 80 | 90 | true |
| 4-1 | 4 | 4 | 1 | 70 | 70 | true |
| 4-2 | 4 | 4 | 2 | 70 | 80 | true |
| 4-3 | 4 | 4 | 3 | 70 | 90 | true |
| 4-4 | 4 | 4 | 4 | 70 | 100 | true |
| 5-1 | 5 | 5 | 1 | 70 | 60 | true |
| 5-2 | 5 | 5 | 2 | 70 | 90 | true |
| 5-3 | 5 | 5 | 3 | 70 | 100 | true |
| 5-4 | 5 | 5 | 4 | 70 | 120 | true |
| 6-1 | 6 | 6 | 1 | 70 | 60 | true |
| 6-2 | 6 | 6 | 2 | 70 | 90 | true |
| 6-3 | 6 | 6 | 3 | 70 | 120 | true |
| 7-1 | 7 | 7 | 1 | 70 | 60 | false |
| 7-2 | 7 | 7 | 2 | 70 | 90 | false |
| 8-1 | 8 | 8 | 1 | 70 | 60 | false |
| 8-2 | 8 | 8 | 2 | 70 | 90 | false |
| 9-1 | 9 | 9 | 1 | 70 | 60 | false |
| 9-2 | 9 | 9 | 2 | 70 | 90 | false |
| 10-1 | 10 | 10 | 1 | 70 | 60 | false |
| 10-2 | 10 | 10 | 2 | 70 | 90 | false |
| 11-1 | 11 | 11 | 1 | 70 | 60 | false |
| 11-2 | 11 | 11 | 2 | 70 | 90 | false |
| 12-1 | 12 | 12 | 1 | 70 | 60 | false |
| 12-2 | 12 | 12 | 2 | 70 | 90 | false |
| 12-3 | 12 | 12 | 3 | 80 | 200 | false |

## Checkpoints

| checkpoint_id | order_index | after_module_id | before_module_id | passing_score | xp_reward |
|---|---:|---|---|---:|---:|
| checkpoint-1 | 1 | 3 | 4 | 70 | 45 |

## Summary Counts

- Modules: `12`
- Missions total: `32`
- Implemented missions: `19`
- Unimplemented missions: `13`
- Checkpoints total: `1`
- Implemented checkpoints: `1`
- Ranks total: `4`
- Duplicate mission IDs: `none found`
- Duplicate badge IDs: `none found`

## Notes

- Any missing passingScore: none found
- Any missing xpReward: none found
- Any unimplemented missions: yes, modules `7` through `12` contain unimplemented missions
- Any ID inconsistencies:
  - rank IDs do not exist yet in `src/data/ranks.ts`
  - module IDs are numeric in frontend, while the backend plan expects text normalization at integration time
  - mission IDs are already stable text IDs and are suitable for catalog seeding
  - checkpoint IDs are already stable text IDs and are suitable for catalog seeding
- XP modeling note:
  - `module.xpReward` is not a reliable backend reward source
  - for several modules it does **not** equal the sum of `mission.xpReward`
  - backend seeding should trust per-mission `xpReward` and checkpoint `xpReward`, not module-level reward display values
- Plan alignment note:
  - actual checkpoint reward in frontend data is `45`
  - if any backend seed example or draft plan still shows `100` for `checkpoint-1`, it should be corrected before implementation

## Progress Model Observed

Current frontend progress shape from `src/types/progress.ts`:

```ts
{
  xp: number;
  completedMissions: string[];
  completedCheckpoints: string[];
  badges: string[];
  missionScores: Record<string, number>;
  checkpointScores: Record<string, number>;
}
```

Current persistence source:

```txt
localStorage key: mss2_prog
```

## Progression Rules Observed

Current unlock logic from `src/utils/progression.ts`:

- Module 1 unlocks by default
- A module after a checkpoint requires that checkpoint
- Otherwise a module unlocks after all previous module missions are completed
- The first mission in a module unlocks when the module unlocks
- Later missions unlock sequentially after the previous mission

Important current frontend override:

```txt
UNLOCK_ALL_FOR_TESTING = true
```

This must be ignored by the backend implementation later.

## Mission Flow Observed

Current mission flow from `src/screens/MissionScreen.tsx`:

1. `briefing`
2. `vocab`
3. `phrases`
4. `activity`

Supported implemented activity mappings currently include:

- matching
- listen_and_choose
- listen_and_match
- drag_drop
- classification
- multiple_choice
- sequence
- phrase_ordering
- phrase_choice
- error_correction
- media_classification
- media_format_selection
- media_property_check
- media_kit_assembly
- binary_lock
- number_mission

Mission types currently present in catalog data:

- matching
- listen_and_choose
- listen_and_match
- drag_drop
- classification
- multiple_choice
- sequence
- media_classification
- media_format_selection
- media_property_check
- media_kit_assembly
- binary_lock
- number_mission
- final_mixed

Coverage note:

- `final_mixed` exists in mission data (`12-3`) but is not mapped in `ACTIVITY_MAP`
- this is currently acceptable because mission `12-3` is also `implemented: false`

## Proposed Changes Before Code Edits

These are proposed from Phase 0 inspection only. They are not applied yet.

1. Update `src/data/ranks.ts` to add stable `id` fields:
   - `rank_01`
   - `rank_02`
   - `rank_03`
   - `rank_04`

2. Keep the lowest-XP rank permanently mapped to:

```txt
rank_01
```

3. Preserve existing mission IDs and checkpoint IDs exactly as they are during backend seeding.

4. Normalize module IDs with `String(module.id)` during backend seeding and frontend integration.

5. Treat `UNLOCK_ALL_FOR_TESTING` as a frontend-only QA override and do not copy that behavior into backend logic.

6. Use only implemented missions and implemented checkpoints as completable entities in backend validation.

7. Keep guest local progress untouched for now; migration from localStorage is not part of Phase 0.

8. Treat `module.xpReward` as presentation data unless product rules explicitly redefine it later; do not seed it into authoritative completion logic.

9. Before Phase 6 seeding, verify all seed examples and comments against extracted frontend truth, especially checkpoint reward values.
