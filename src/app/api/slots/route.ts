//src/app/api/slots/route.ts
import { NextResponse } from 'next/server'
import { supabaseAnon } from '@/lib/supabaseServer'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing from/to' }, { status: 400 })
  }

  const { data, error } = await supabaseAnon.rpc('get_available_slots', {
    p_from_date: from,
    p_to_date: to,
  })

  if (error) {
    console.error('Error fetching slots:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, slots: data })
}
