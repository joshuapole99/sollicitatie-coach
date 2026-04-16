// app/api/tracker/route.ts — Job application CRUD
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// GET — list all applications for the user
export async function GET() {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — create a new application
export async function POST(req: NextRequest) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { company, role, status, notes, applied_at } = body;

  if (!company?.trim() || !role?.trim())
    return NextResponse.json({ error: 'company en role zijn verplicht.' }, { status: 400 });

  const { data, error } = await supabase
    .from('applications')
    .insert({ user_id: user.id, company: company.trim(), role: role.trim(), status: status || 'applied', notes: notes?.trim() || null, applied_at: applied_at || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH — update an application
export async function PATCH(req: NextRequest) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { id, company, role, status, notes, applied_at } = body;

  if (!id) return NextResponse.json({ error: 'id is verplicht.' }, { status: 400 });

  const { data, error } = await supabase
    .from('applications')
    .update({ company: company?.trim(), role: role?.trim(), status, notes: notes?.trim() || null, applied_at: applied_at || null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — delete an application
export async function DELETE(req: NextRequest) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { id } = body;

  if (!id) return NextResponse.json({ error: 'id is verplicht.' }, { status: 400 });

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
