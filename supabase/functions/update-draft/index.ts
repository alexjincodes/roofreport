import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, mergePhotoPaths } from '../_shared/supabaseAdmin.ts';
import { sendReviewEmail } from '../_shared/resend.ts';

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
      .select('photo_urls, status, admin_email')
      .eq('token', token)
      .maybeSingle();
    if (fetchError || !existing) return jsonResponse({ error: 'Not found' }, 404);

    const { form_data, narrative_overrides, photo_paths } = await req.json();
    if (!form_data || typeof form_data !== 'object') {
      return jsonResponse({ error: 'form_data is required' }, 400);
    }

    const photoUrls = mergePhotoPaths(existing.photo_urls || {}, photo_paths);

    // A staff-created assignment (address only, no review email sent yet) is
    // completed here for the first time by a technician — this save is what
    // should notify the admin, same as a from-scratch submission would.
    // Anything past that point (already submitted/reviewed) is an admin edit,
    // which just saves in place without re-notifying anyone.
    const wasAssigned = existing.status === 'assigned';
    const newStatus = wasAssigned ? 'submitted' : 'reviewed';

    const { error: updateError } = await admin
      .from('report_drafts')
      .update({
        form_data,
        narrative_overrides: narrative_overrides || {},
        photo_urls: photoUrls,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('token', token);
    if (updateError) throw updateError;

    if (wasAssigned) {
      await sendReviewEmail(token, form_data.propertyAddress, existing.admin_email);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Failed to update draft' }, 500);
  }
});
