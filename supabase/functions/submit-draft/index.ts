import { corsHeaders, handleOptions, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, mergePhotoPaths } from '../_shared/supabaseAdmin.ts';
import { generateToken } from '../_shared/token.ts';
import { sendReviewEmail } from '../_shared/resend.ts';

const ADMIN_EMAIL = 'nick@epservices.co.nz';

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { token: existingToken, form_data, narrative_overrides, photo_paths } = await req.json();
    if (!form_data || typeof form_data !== 'object') {
      return jsonResponse({ error: 'form_data is required' }, 400);
    }

    const admin = supabaseAdmin();
    // A token is only pre-issued by create-upload-urls when the draft has
    // photos attached; drafts with no photos never call that endpoint.
    const token = existingToken || generateToken();

    const { error } = await admin.from('report_drafts').insert({
      token,
      form_data,
      narrative_overrides: narrative_overrides || {},
      photo_urls: mergePhotoPaths({}, photo_paths),
      admin_email: ADMIN_EMAIL,
    });
    if (error) throw error;

    await sendReviewEmail(token, form_data.propertyAddress, ADMIN_EMAIL);

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Failed to submit draft' }, 500);
  }
});
