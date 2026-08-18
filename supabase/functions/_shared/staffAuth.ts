// STAFF_PASSWORD is an Edge Function secret set via the Supabase dashboard/CLI.
// Gates the staff-facing "create assignment link" / "job list" endpoints —
// this app has no real login system, so this is a lightweight shared-password
// check, not proper auth.
export function checkStaffAuth(req: Request): boolean {
  const expected = Deno.env.get('STAFF_PASSWORD');
  if (!expected) return false;
  return req.headers.get('x-staff-password') === expected;
}
