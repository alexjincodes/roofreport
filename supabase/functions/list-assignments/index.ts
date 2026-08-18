import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { checkStaffAuth } from '../_shared/staffAuth.ts';
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';

// Staff-facing list of every draft (assigned / submitted / reviewed), newest
// first, so a link can be found again without digging through email.
Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!checkStaffAuth(req)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from('report_drafts')
      .select('token, status, form_data, submitted_at, updated_at')
      .order('submitted_at', { ascending: false })
      .limit(200);
    if (error) throw error;

    const drafts = (data || []).map((row) => ({
      token: row.token,
      status: row.status,
      address: row.form_data?.propertyAddress || row.form_data?.gutterDetailsPropertyAddress || 'Untitled',
      submittedAt: row.submitted_at,
      updatedAt: row.updated_at,
    }));

    return jsonResponse({ drafts });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Failed to list assignments' }, 500);
  }
});
