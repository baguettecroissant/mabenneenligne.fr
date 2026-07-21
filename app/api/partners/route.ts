export async function POST(request: Request) {
  const input = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!input?.entreprise || !input?.responsable || !input?.telephone || !input?.email) return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return Response.json({ error: "Service partenaire non configuré" }, { status: 503 });
  const response = await fetch(`${supabaseUrl}/rest/v1/transporter_applications`, { method: "POST", headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "content-type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ ...input, source: "mabenneenligne.fr", status: "nouveau" }) });
  if (!response.ok) return Response.json({ error: "Enregistrement impossible" }, { status: 502 });
  return Response.json({ ok: true }, { status: 201 });
}
