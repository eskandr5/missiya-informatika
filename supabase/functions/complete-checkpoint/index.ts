import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.0';

type CompleteCheckpointRequest = {
  checkpointId?: unknown;
  score?: unknown;
  completionTime?: unknown;
  activityType?: unknown;
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

  let body: CompleteCheckpointRequest;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const checkpointId = typeof body.checkpointId === 'string' ? body.checkpointId.trim() : '';
  const score = body.score;

  if (!checkpointId) {
    return jsonResponse({ error: 'Missing checkpointId' }, 400);
  }

  if (
    typeof score !== 'number'
    || !Number.isFinite(score)
    || !Number.isInteger(score)
    || score < 0
    || score > 100
  ) {
    return jsonResponse({ error: 'Score must be an integer between 0 and 100' }, 400);
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
  const metadata = {
    completionTime,
    activityType,
  };

  const { data, error } = await adminClient.rpc('complete_checkpoint_internal', {
    p_user_id: userData.user.id,
    p_checkpoint_id: checkpointId,
    p_score: score,
    p_metadata: metadata,
  });

  if (error) {
    const message = error.message || 'Checkpoint completion failed';
    const status = message.includes('not found')
      ? 404
      : message.includes('locked') || message.includes('not attached')
        ? 409
        : 400;

    return jsonResponse({ error: message }, status);
  }

  return jsonResponse(data);
});
