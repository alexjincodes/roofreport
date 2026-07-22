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

export type PendingPhoto = {
  fieldName: string;
  filename: string;
  contentType: string;
  base64: string;
};

// Uploads any pending photos for a draft and returns storage paths grouped by
// field name, merged on top of any existing paths (used by update-draft to
// append rather than overwrite).
export async function uploadPhotos(
  admin: ReturnType<typeof supabaseAdmin>,
  token: string,
  photos: PendingPhoto[] | undefined,
  existing: Record<string, string[]>,
): Promise<Record<string, string[]>> {
  if (!photos || photos.length === 0) return existing;

  const merged: Record<string, string[]> = { ...existing };
  for (const photo of photos) {
    const bytes = Uint8Array.from(atob(photo.base64), (c) => c.charCodeAt(0));
    const path = `${token}/${photo.fieldName}/${Date.now()}-${photo.filename}`;
    const { error } = await admin.storage.from(PHOTOS_BUCKET).upload(path, bytes, {
      contentType: photo.contentType,
      upsert: false,
    });
    if (error) throw new Error(`Photo upload failed (${photo.fieldName}): ${error.message}`);
    merged[photo.fieldName] = [...(merged[photo.fieldName] || []), path];
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
