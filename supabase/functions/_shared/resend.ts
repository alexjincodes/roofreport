// SITE_URL and RESEND_API_KEY are Edge Function secrets set via the Supabase
// dashboard/CLI (not committed anywhere, never exposed to the client).
export async function sendReviewEmail(token: string, address: string, adminEmail: string) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:8000';
  if (!apiKey) {
    console.error('RESEND_API_KEY not set — skipping email send');
    return;
  }

  const reviewLink = `${siteUrl}/index.html?token=${token}`;
  console.log(`Sending review email with link: ${reviewLink}`);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Roof Reports <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `New Roof Report Draft — ${address || 'Untitled'}`,
      html: `
        <p>A new roof inspection report draft has been submitted for review.</p>
        <p><a href="${reviewLink}">${reviewLink}</a></p>
        <p>Open the link to proofread the selections and edit anything that needs correcting.</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Resend API error (${res.status}): ${body}`);
  }
}
