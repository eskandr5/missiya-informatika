import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.0';
import {
  scoreMissionAnswers,
  type MissionValidationRow,
} from '../_shared/scoring.ts';

type CompleteMissionRequest = {
  missionId?: unknown;
  score?: unknown;
  completionTime?: unknown;
  activityType?: unknown;
  answers?: unknown;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: 'Server configuration is incomplete' }, 500);
  }

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return jsonResponse({ error: 'Missing Authorization header' }, 401);
  }

  let body: CompleteMissionRequest;

  try {
    const parsedBody: unknown = await request.json();

    if (!isRecord(parsedBody)) {
      return jsonResponse({ error: 'JSON body must be an object' }, 400);
    }

    body = parsedBody;
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const missionId = typeof body.missionId === 'string' ? body.missionId.trim() : '';
  const submittedScore = body.score;

  if (!missionId) {
    return jsonResponse({ error: 'Missing missionId' }, 400);
  }

  let score: number | null = null;

  if (submittedScore !== undefined) {
    if (
      typeof submittedScore !== 'number'
      || !Number.isFinite(submittedScore)
      || !Number.isInteger(submittedScore)
      || submittedScore < 0
      || submittedScore > 100
    ) {
      return jsonResponse({ error: 'Score must be an integer between 0 and 100' }, 400);
    }

    score = submittedScore;
  } else if (body.answers === undefined) {
    return jsonResponse({ error: 'Provide either score or answers' }, 400);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: authorization,
      },
    },
    auth: {
      persistSession: false,
    },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();

  if (userError || !userData.user) {
    return jsonResponse({ error: 'Unauthenticated' }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  const completionTime = typeof body.completionTime === 'number'
    && Number.isFinite(body.completionTime)
    && body.completionTime >= 0
    ? body.completionTime
    : null;
  const activityType = typeof body.activityType === 'string'
    && body.activityType.trim().length > 0
    && body.activityType.trim().length <= 64
    ? body.activityType.trim()
    : null;

  if (body.answers !== undefined && !activityType && score === null) {
    return jsonResponse({ error: 'activityType is required when submitting answers without a score' }, 400);
  }

  if (body.answers !== undefined && activityType) {
    const { data: validationRows, error: validationError } = await adminClient
      .from('mission_validation')
      .select('mission_id, activity_type, validation_payload, scoring_version')
      .eq('mission_id', missionId)
      .eq('activity_type', activityType)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (validationError) {
      return jsonResponse({ error: 'Failed to load mission validation data' }, 500);
    }

    const validation = (validationRows?.[0] ?? null) as MissionValidationRow | null;

    if (validation) {
      try {
        score = scoreMissionAnswers(validation, body.answers).score;
      } catch (error) {
        return jsonResponse({
          error: error instanceof Error ? error.message : 'Unable to score submitted answers',
        }, 400);
      }
    } else if (score === null) {
      return jsonResponse({ error: 'No server validation data exists for this mission; provide score' }, 400);
    }
  }

  if (score === null) {
    return jsonResponse({ error: 'Score could not be determined' }, 400);
  }

  const metadata = {
    completionTime,
    activityType,
  };

  const { data, error } = await adminClient.rpc('complete_mission_internal', {
    p_user_id: userData.user.id,
    p_mission_id: missionId,
    p_score: score,
    p_metadata: metadata,
  });

  if (error) {
    const message = error.message || 'Mission completion failed';
    const lowerMessage = message.toLowerCase();
    const status = lowerMessage.includes('not found')
      ? 404
      : lowerMessage.includes('locked') || lowerMessage.includes('not implemented')
        ? 409
        : 400;

    return jsonResponse({ error: message }, status);
  }

  return jsonResponse(data);
});
