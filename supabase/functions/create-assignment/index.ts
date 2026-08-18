import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { checkStaffAuth } from '../_shared/staffAuth.ts';
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';
import { generateToken } from '../_shared/token.ts';

const ADMIN_EMAIL = 'nick@epservices.co.nz';

// Staff creates a bare draft with just an address and gets back a token/link
// to send a technician. No review email here — the technician's own
// completion (via update-draft) is what notifies the admin for review.
Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!checkStaffAuth(req)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  try {
    const { address } = await req.json();
    if (!address || typeof address !== 'string' || !address.trim()) {
      return jsonResponse({ error: 'address is required' }, 400);
    }

    const admin = supabaseAdmin();
    const token = generateToken();

    const { error } = await admin.from('report_drafts').insert({
      token,
      status: 'assigned',
      form_data: { propertyAddress: address.trim() },
      narrative_overrides: {},
      photo_urls: {},
      admin_email: ADMIN_EMAIL,
    });
    if (error) throw error;

    return jsonResponse({ token });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Failed to create assignment' }, 500);
  }
});
