import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, mergePhotoPaths } from '../_shared/supabaseAdmin.ts';

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const token = new URL(req.url).searchParams.get('token');
  if (!token) return jsonResponse({ error: 'Not found' }, 404);

  try {
    const admin = supabaseAdmin();

    const { data: existing, error: fetchError } = await admin
      .from('report_drafts')
      .select('photo_urls')
      .eq('token', token)
      .maybeSingle();
    if (fetchError || !existing) return jsonResponse({ error: 'Not found' }, 404);

    const { form_data, narrative_overrides, photo_paths } = await req.json();
    if (!form_data || typeof form_data !== 'object') {
      return jsonResponse({ error: 'form_data is required' }, 400);
    }

    const photoUrls = mergePhotoPaths(existing.photo_urls || {}, photo_paths);

    const { error: updateError } = await admin
      .from('report_drafts')
      .update({
        form_data,
        narrative_overrides: narrative_overrides || {},
        photo_urls: photoUrls,
        status: 'reviewed',
        updated_at: new Date().toISOString(),
      })
      .eq('token', token);
    if (updateError) throw updateError;

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Failed to update draft' }, 500);
  }
});
