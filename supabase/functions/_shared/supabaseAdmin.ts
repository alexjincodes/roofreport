import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected into every
// Edge Function's environment by Supabase. The service-role key bypasses RLS,
// which is what makes token-only access control possible: report_drafts has
// RLS enabled with no policies, so only this admin client (server-side only,
// never shipped to the browser) can read or write it.
export function supabaseAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

const PHOTOS_BUCKET = 'report-photos';

export type RequestedPhoto = {
  fieldName: string;
  filename: string;
};

// Creates a signed upload URL per requested photo (client uploads the raw
// file bytes directly to Storage via supabase-js's uploadToSignedUrl — no
// base64/JSON round trip through the Edge Function, which is what let large
// iPhone photos blow past request limits).
export async function createSignedUploadUrls(
  admin: ReturnType<typeof supabaseAdmin>,
  token: string,
  photos: RequestedPhoto[],
): Promise<Array<{ fieldName: string; path: string; uploadToken: string }>> {
  const results = [];
  for (const photo of photos) {
    const path = `${token}/${photo.fieldName}/${Date.now()}-${photo.filename}`;
    const { data, error } = await admin.storage.from(PHOTOS_BUCKET).createSignedUploadUrl(path);
    if (error || !data) throw new Error(`Could not create upload URL (${photo.fieldName}): ${error?.message}`);
    results.push({ fieldName: photo.fieldName, path, uploadToken: data.token });
  }
  return results;
}

// Merges freshly-uploaded photo paths (grouped by field name) on top of any
// paths already stored for the draft (used by update-draft to append rather
// than overwrite).
export function mergePhotoPaths(
  existing: Record<string, string[]>,
  incoming: Record<string, string[]> | undefined,
): Record<string, string[]> {
  if (!incoming) return existing;
  const merged: Record<string, string[]> = { ...existing };
  for (const [fieldName, paths] of Object.entries(incoming)) {
    merged[fieldName] = [...(merged[fieldName] || []), ...paths];
  }
  return merged;
}

// Replaces stored paths with fresh signed URLs (1hr) for returning to the client.
export async function signPhotoUrls(
  admin: ReturnType<typeof supabaseAdmin>,
  photoPaths: Record<string, string[]>,
): Promise<Record<string, string[]>> {
  const signed: Record<string, string[]> = {};
  for (const [fieldName, paths] of Object.entries(photoPaths)) {
    signed[fieldName] = [];
    for (const path of paths) {
      const { data, error } = await admin.storage
        .from(PHOTOS_BUCKET)
        .createSignedUrl(path, 3600);
      if (!error && data) signed[fieldName].push(data.signedUrl);
    }
  }
  return signed;
}
