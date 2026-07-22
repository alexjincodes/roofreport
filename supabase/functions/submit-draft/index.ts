import { corsHeaders, handleOptions, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, uploadPhotos } from '../_shared/supabaseAdmin.ts';
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
    const { form_data, narrative_overrides, photos } = await req.json();
    if (!form_data || typeof form_data !== 'object') {
      return jsonResponse({ error: 'form_data is required' }, 400);
    }

    const admin = supabaseAdmin();
    const token = generateToken();

    const photoUrls = await uploadPhotos(admin, token, photos, {});

    const { error } = await admin.from('report_drafts').insert({
      token,
      form_data,
      narrative_overrides: narrative_overrides || {},
      photo_urls: photoUrls,
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
