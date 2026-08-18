export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://roofreport.onrender.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-staff-password',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function handleOptions(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
