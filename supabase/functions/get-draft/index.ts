import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, signPhotoUrls } from '../_shared/supabaseAdmin.ts';

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const token = new URL(req.url).searchParams.get('token');
  if (!token) return jsonResponse({ error: 'Not found' }, 404);

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from('report_drafts')
    .select('form_data, narrative_overrides, photo_urls, status, submitted_at')
    .eq('token', token)
    .maybeSingle();

  // Generic 404 for both "no such row" and any lookup error, so a wrong
  // token can't be distinguished from an expired/unknown one (no oracle).
  if (error || !data) return jsonResponse({ error: 'Not found' }, 404);

  const signedPhotoUrls = await signPhotoUrls(admin, data.photo_urls || {});

  return jsonResponse({
    form_data: data.form_data,
    narrative_overrides: data.narrative_overrides,
    photo_urls: signedPhotoUrls,
    status: data.status,
    submitted_at: data.submitted_at,
  });
});
