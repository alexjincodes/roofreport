import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, createSignedUploadUrls, RequestedPhoto } from '../_shared/supabaseAdmin.ts';
import { generateToken } from '../_shared/token.ts';

// Called before submit-draft/update-draft whenever the form has new photos to
// upload. Returns a draft token (reused if the caller is already reviewing an
// existing draft) plus one signed upload slot per requested photo, so the
// browser can PUT file bytes straight to Storage instead of bundling them as
// base64 into a single JSON request.
Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { token: existingToken, photos } = await req.json();
    if (!Array.isArray(photos) || photos.length === 0) {
      return jsonResponse({ error: 'photos is required' }, 400);
    }

    const token = existingToken || generateToken();
    const admin = supabaseAdmin();
    const uploads = await createSignedUploadUrls(admin, token, photos as RequestedPhoto[]);

    return jsonResponse({ token, uploads });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Failed to create upload URLs' }, 500);
  }
});
